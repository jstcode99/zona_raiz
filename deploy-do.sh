#!/bin/bash
# zona_raiz - Deploy Script for Digital Ocean
# Usage: ./deploy-do.sh [options]
#
# Options:
#   --skip-clone    Skip git clone (use existing repo)
#   --skip-build   Skip docker build (use existing image)
#   --backup       Run database backup before deploy

set -euo pipefail

# ============================================
# CONFIGURATION
# ============================================
REPO_URL="https://github.com/jstcode99/zona_raiz.git"
APP_DIR="/opt/zona_raiz"
PORT_HTTP=80
PORT_HTTPS=443
SWAP_SIZE="2G"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================
# PARSE ARGUMENTS
# ============================================
SKIP_CLONE=false
SKIP_BUILD=false
RUN_BACKUP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-clone) SKIP_CLONE=true; shift ;;
        --skip-build) SKIP_BUILD=true; shift ;;
        --backup) RUN_BACKUP=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# ============================================
# PRE-CHECKS
# ============================================
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

check_os() {
    if [[ ! -f /etc/os-release ]]; then
        log_error "Cannot detect OS"
        exit 1
    fi
    
    source /etc/os-release
    if [[ "$ID" != "ubuntu" && "$ID" != "debian" ]]; then
        log_warn "This script is optimized for Ubuntu/Debian. Detected: $ID"
    fi
}

# ============================================
# INSTALL DOCKER
# ============================================
install_docker() {
    log_info "Installing Docker..."
    
    # Update package index
    apt-get update -y
    
    # Install prerequisites
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        jq \
        unzip
    
    # Add Docker GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Add Docker repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Enable and start Docker
    systemctl enable docker
    systemctl start docker
    
    # Add docker group (if not exists)
    getent group docker > /dev/null || groupadd docker
    
    log_info "Docker installed successfully"
}

# ============================================
# CONFIGURE FIREWALL
# ============================================
configure_firewall() {
    log_info "Configuring firewall..."
    
    # Install ufw if not present
    apt-get install -y ufw
    
    # Reset ufw to default
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (prevent lockout)
    ufw allow 22/tcp comment 'SSH'
    
    # Allow HTTP/HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Allow Docker ports
    ufw allow 3000/tcp comment 'Next.js'
    ufw allow 3001/tcp comment 'Grafana'
    ufw allow 5432/tcp comment 'PostgreSQL'
    ufw allow 8000/tcp comment 'Kong HTTP'
    ufw allow 8001/tcp comment 'Kong Admin'
    ufw allow 9000/tcp comment 'MinIO'
    ufw allow 9001/tcp comment 'MinIO Console'
    ufw allow 3100/tcp comment 'Loki'
    ufw allow 8025/tcp comment 'Mailhog UI'
    
    # Enable ufw
    echo "y" | ufw enable
    
    log_info "Firewall configured"
}

# ============================================
# CONFIGURE SWAP
# ============================================
configure_swap() {
    if [[ $(free -g | awk '/^Mem:/{print $2}') -ge 8 ]]; then
        log_info "Sufficient RAM detected, skipping swap"
        return
    fi
    
    log_info "Configuring swap..."
    
    if [[ -f /swapfile ]]; then
        log_info "Swap file already exists"
        return
    fi
    
    fallocate -l $SWAP_SIZE /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Add to fstab
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    
    # Configure swappiness
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    
    log_info "Swap configured: $SWAP_SIZE"
}

# ============================================
# CLONE & CONFIGURE REPO
# ============================================
clone_repo() {
    if [[ "$SKIP_CLONE" == true ]]; then
        log_info "Skipping clone..."
        return
    fi
    
    log_info "Cloning repository..."
    
    # Create app directory
    mkdir -p "$APP_DIR"
    cd "$APP_DIR"
    
    # Clone repo
    if [[ -d .git ]]; then
        log_info "Repo already exists, pulling..."
        git pull origin master
    else
        git clone "$REPO_URL" .
    fi
    
    log_info "Repository cloned"
}

# ============================================
# CONFIGURE ENVIRONMENT
# ============================================
configure_env() {
    log_info "Configuring environment variables..."
    
    cd "$APP_DIR"
    
    # Create .env if not exists
    if [[ ! -f .env ]]; then
        if [[ -f .env.example ]]; then
            cp .env.example .env
        else
            # Create basic .env
            cat > .env << 'EOF'
# PostgreSQL
POSTGRES_PASSWORD=change_me_in_production

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin123

# Supabase (for local dev)
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF
        fi
        log_warn "Created .env file - UPDATE WITH PRODUCTION VALUES!"
    else
        log_info ".env already exists"
    fi
}

# ============================================
# BUILD & START SERVICES
# ============================================
deploy_app() {
    log_info "Building and starting services..."
    
    cd "$APP_DIR"
    
    # Create required directories
    mkdir -p ./kong ./promtail ./grafana/provisioning/datasources ./grafana/provisioning/dashboards
    mkdir -p /backups/postgres
    
    # Create docker network if not exists
    docker network create zona_raiz_network 2>/dev/null || true
    
    # Pull base images first
    if [[ "$SKIP_BUILD" != true ]]; then
        log_info "Pulling base images..."
        docker compose pull
    fi
    
    # Build and start
    log_info "Starting services..."
    docker compose up -d --build
    
    # Wait for services to be healthy
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check status
    docker compose ps
    
    log_info "Deployment complete!"
}

# ============================================
# BACKUP (optional)
# ============================================
run_backup() {
    if [[ "$RUN_BACKUP" != true ]]; then
        return
    fi
    
    log_info "Running database backup..."
    
    mkdir -p /backups/postgres
    
    # Backup PostgreSQL
    DATE=$(date +%Y%m%d_%H%M%S)
    docker exec zona_raiz_postgres pg_dump -U postgres postgres | gzip > "/backups/postgres/pre-deploy_$DATE.sql.gz"
    
    log_info "Backup saved to /backups/postgres/pre-deploy_$DATE.sql.gz"
}

# ============================================
# POST-DEPLOY INFO
# ============================================
print_info() {
    echo ""
    echo "=============================================="
    echo "  zona_raiz deployed successfully!"
    echo "=============================================="
    echo ""
    echo "Services:"
    echo "  - Next.js:        http://localhost:3000"
    echo "  - Kong:           http://localhost:8000"
    echo "  - MinIO Console:  http://localhost:9001"
    echo "  - Grafana:        http://localhost:3001"
    echo "  - Mailhog:        http://localhost:8025"
    echo "  - Loki:           http://localhost:3100"
    echo ""
    echo "Useful commands:"
    echo "  docker compose logs -f         # View logs"
    echo "  docker compose ps              # Check status"
    echo "  docker compose restart         # Restart services"
    echo "  docker compose down            # Stop services"
    echo ""
    echo "IMPORTANT:"
    echo "  1. Update .env with production values"
    echo "  2. Set up domain and SSL (Let's Encrypt)"
    echo "  3. Configure MinIO bucket"
    echo "  4. Update Kong routes"
    echo ""
}

# ============================================
# MAIN
# ============================================
main() {
    log_info "Starting zona_raiz deployment..."
    
    check_root
    check_os
    
    configure_swap
    install_docker
    configure_firewall
    clone_repo
    configure_env
    run_backup
    deploy_app
    print_info
}

main "$@"