#!/bin/bash
# zona_raiz - Simplified Deploy Script
# Usage: ./deploy.sh [options]
#
# This script builds and deploys only the Next.js Docker container.
# Environment variables are loaded from .env file.
#
# Options:
#   --skip-build    Skip docker build (use existing image)
#   --local         Run locally instead of pushing to registry

set -euo pipefail

# ============================================
# CONFIGURATION
# ============================================
PROJECT_NAME="zona_raiz"
IMAGE_NAME="$PROJECT_NAME/nextjs"
IMAGE_TAG="${IMAGE_TAG:-latest}"
REGISTRY="${REGISTRY:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# ============================================
# PRE-CHECKS
# ============================================
check_env_file() {
    if [[ ! -f .env ]]; then
        if [[ -f .env.example ]]; then
            log_warn "No .env file found. Copying from .env.example..."
            cp .env.example .env
            log_warn "Created .env - UPDATE WITH YOUR VALUES BEFORE CONTINUING!"
        else
            log_error "No .env or .env.example found. Please create a .env file."
            exit 1
        fi
    fi
    log_info "Using .env file for environment variables"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    
    log_info "Docker is available"
}

check_dockerfile() {
    if [[ ! -f Dockerfile ]]; then
        log_error "No Dockerfile found in current directory"
        exit 1
    fi
    log_info "Dockerfile found"
}

# ============================================
# BUILD IMAGE
# ============================================
build_image() {
    log_step "Building Docker image..."
    
    local full_image_name="$IMAGE_NAME:$IMAGE_TAG"
    
    if [[ -n "$REGISTRY" ]]; then
        full_image_name="$REGISTRY/$full_image_name"
    fi
    
    log_info "Building image: $full_image_name"
    
    # Build with buildx for multi-platform support
    docker build \
        --pull \
        --tag "$full_image_name" \
        .
    
    log_info "Image built successfully: $full_image_name"
    
    # Export for other functions
    echo "$full_image_name"
}

# ============================================
# PUSH IMAGE (optional)
# ============================================
push_image() {
    local full_image_name="$1"
    
    if [[ -n "$REGISTRY" ]]; then
        log_step "Pushing image to registry..."
        docker push "$full_image_name"
        log_info "Image pushed to registry"
    else
        log_info "No registry configured, skipping push"
    fi
}

# ============================================
# RUN CONTAINER LOCALLY
# ============================================
run_container() {
    log_step "Starting container locally..."
    
    # Stop existing container if running
    if docker ps -q -f name="$PROJECT_NAME" | grep -q .; then
        log_info "Stopping existing container..."
        docker stop "$PROJECT_NAME" 2>/dev/null || true
        docker rm "$PROJECT_NAME" 2>/dev/null || true
    fi
    
    # Run new container
    log_info "Starting Next.js container on port 3000..."
    docker run -d \
        --name "$PROJECT_NAME" \
        --env-file .env \
        -p 3000:3000 \
        --restart unless-stopped \
        "$IMAGE_NAME:$IMAGE_TAG"
    
    log_info "Container started successfully"
}

# ============================================
# VERIFY DEPLOYMENT
# ============================================
verify_deployment() {
    log_step "Verifying deployment..."
    
    sleep 5
    
    if docker ps | grep -q "$PROJECT_NAME"; then
        log_info "Container is running"
        docker ps --filter "name=$PROJECT_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        return 0
    else
        log_error "Container is not running"
        docker logs "$PROJECT_NAME" --tail 20
        return 1
    fi
}

# ============================================
# PRINT USAGE INFO
# ============================================
print_info() {
    echo ""
    echo "=============================================="
    echo "  zona_raiz deployment complete!"
    echo "=============================================="
    echo ""
    echo "Image: $IMAGE_NAME:$IMAGE_TAG"
    echo ""
    echo "Access:"
    echo "  - Next.js: http://localhost:3000"
    echo ""
    echo "Useful commands:"
    echo "  docker logs $PROJECT_NAME      # View logs"
    echo "  docker stop $PROJECT_NAME       # Stop container"
    echo "  docker rm $PROJECT_NAME         # Remove container"
    echo "  docker restart $PROJECT_NAME    # Restart container"
    echo ""
    echo "Environment variables used:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - NEXT_PUBLIC_GOOGLE_CLIENT_ID"
    echo "  - GOOGLE_CLIENT_SECRET"
    echo "  - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
    echo ""
}

# ============================================
# MAIN
# ============================================
main() {
    SKIP_BUILD=false
    RUN_LOCAL=true
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-build) SKIP_BUILD=true; shift ;;
            --local) RUN_LOCAL=true; shift ;;
            --push) RUN_LOCAL=false; shift ;;
            -h|--help)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --skip-build    Skip docker build"
                echo "  --local         Run container locally (default)"
                echo "  --push          Push to registry instead of running locally"
                echo "  -h, --help      Show this help"
                exit 0
                ;;
            *) echo "Unknown option: $1"; exit 1 ;;
        esac
    done
    
    echo ""
    echo "=============================================="
    echo "  zona_raiz - Simplified Deploy Script"
    echo "=============================================="
    echo ""
    
    # Run pre-checks
    check_docker
    check_dockerfile
    check_env_file
    
    # Build image
    if [[ "$SKIP_BUILD" != true ]]; then
        IMAGE_FULL=$(build_image)
    else
        IMAGE_FULL="$IMAGE_NAME:$IMAGE_TAG"
        if [[ -n "$REGISTRY" ]]; then
            IMAGE_FULL="$REGISTRY/$IMAGE_FULL"
        fi
        log_info "Skipping build, using existing image: $IMAGE_FULL"
    fi
    
    # Run or push
    if [[ "$RUN_LOCAL" == true ]]; then
        push_image "$IMAGE_FULL"
        run_container
        verify_deployment
        print_info
    else
        push_image "$IMAGE_FULL"
        log_info "Image ready for deployment: $IMAGE_FULL"
    fi
}

main "$@"