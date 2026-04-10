#!/bin/bash
# ============================================
# zona_raiz - Supabase Backup & Restore Script
# ============================================
# This script handles:
#   - PostgreSQL database backups
#   - Storage (MinIO) backups
#   - Scheduled backups (cron)
#   - Restore from backup
#
# Usage:
#   ./scripts/supabase-backup.sh backup           # Create backup
#   ./scripts/supabase-backup.sh backup-folder     # Create folder backup
#   ./scripts/supabase-backup.sh restore PATH    # Restore from backup
#   ./scripts/supabase-backup.sh list           # List backups
#   ./scripts/supabase-backup.sh prune DAYS     # Remove old backups
# ============================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-/backups/supabase}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

# Load environment
ENV_FILE="$PROJECT_ROOT/.env.supabase"
if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
fi

# Functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Ensure backup directory
ensure_backup_dir() {
    mkdir -p "$BACKUP_DIR/postgres"
    mkdir -p "$BACKUP_DIR/storage"
}

# Create backup
create_backup() {
    ensure_backup_dir
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="supabase_backup_${timestamp}"
    local backup_path="$BACKUP_DIR/postgres/${backup_name}.sql.gz"
    
    log_info "Creating database backup: $backup_name"
    
    # Check if postgres container is running
    if ! docker exec supabase_postgres pg_isready -U "${POSTGRES_USER:-postgres}" &>/dev/null; then
        log_error "PostgreSQL container is not running"
        return 1
    fi
    
    # Create database backup
    docker exec supabase_postgres pg_dump -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-postgres}" | gzip > "$backup_path"
    
    # Verify backup
    if gunzip -t "$backup_path" 2>/dev/null; then
        local size=$(du -h "$backup_path" | cut -f1)
        log_success "Backup created: $backup_path ($size)"
        
        # Store backup info
        echo "$(date +%Y-%m-%d\ %H:%M:%S) - $backup_path - $size" >> "$BACKUP_DIR/backup_list.txt"
        
        return 0
    else
        log_error "Backup verification failed"
        rm -f "$backup_path"
        return 1
    fi
}

# Create folder backup (all data)
create_folder_backup() {
    ensure_backup_dir
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="supabase_full_backup_${timestamp}"
    local backup_path="$BACKUP_DIR/${backup_name}.tar.gz"
    
    log_info "Creating full backup: $backup_name"
    
    # Create backup directory
    local temp_dir="$BACKUP_DIR/temp_${timestamp}"
    mkdir -p "$temp_dir"
    
    # Backup database
    docker exec supabase_postgres pg_dump -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-postgres}" -F c -b -v -f /backup/pgdata.dump || {
        log_error "Database backup failed"
        rm -rf "$temp_dir"
        return 1
    }
    
    # Copy storage data
    log_info "Copying storage data..."
    docker cp supabase_storage:/var/lib/storage "$temp_dir/storage" 2>/dev/null || {
        log_warn "Storage backup skipped (container may not be running)"
    }
    
    # Create archive
    tar -czf "$backup_path" -C "$BACKUP_DIR" "$(basename "$temp_dir")"
    
    # Cleanup
    rm -rf "$temp_dir"
    
    local size=$(du -h "$backup_path" | cut -f1)
    log_success "Full backup created: $backup_path ($size)"
}

# List backups
list_backups() {
    log_info "Available backups:"
    echo ""
    
    if [ -d "$BACKUP_DIR/postgres" ]; then
        ls -lh "$BACKUP_DIR/postgres"/*.sql.gz 2>/dev/null || log_info "No database backups"
    fi
    
    echo ""
    
    if [ -d "$BACKUP_DIR" ]; then
        ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null || log_info "No full backups"
    fi
}

# Restore from backup
restore_backup() {
    local backup_path="$1"
    
    if [ -z "$backup_path" ]; then
        log_error "Backup path required. Usage: $0 restore <backup_path>"
        return 1
    fi
    
    if [ ! -f "$backup_path" ]; then
        log_error "Backup file not found: $backup_path"
        return 1
    fi
    
    log_warn "This will restore the database from: $backup_path"
    log_warn "All current data will be lost!"
    read -p "Type 'yes' to continue: " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_info "Restore cancelled"
        return 0
    fi
    
    log_info "Restoring database..."
    
    # Stop services that might write to DB
    docker stop supabase_kong supabase_gotrue supabase_postgrest 2>/dev/null || true
    
    # Restore database
    gunzip -c "$backup_path" | docker exec -i supabase_postgres psql -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-postgres}" || {
        log_error "Restore failed"
        return 1
    }
    
    # Restart services
    docker start supabase_kong supabase_gotrue supabase_postgrest 2>/dev/null || true
    
    log_success "Database restored successfully"
}

# Prune old backups
prune_backups() {
    local days="${1:-$RETENTION_DAYS}"
    
    log_info "Removing backups older than $days days..."
    
    find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +"$days" -delete
    find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +"$days" -delete
    
    log_success "Old backups pruned"
}

# Setup cron for automated backups
setup_cron() {
    local cron_entry="0 2 * * * cd $PROJECT_ROOT && ./scripts/supabase-backup.sh backup >> /var/log/supabase_backup.log 2>&1"
    
    (crontab -l 2>/dev/null | grep -v "supabase-backup.sh"; echo "$cron_entry") | crontab -
    
    log_success "Cron job set up for daily backups at 2 AM"
    log_info "To view crontab: crontab -l"
    log_info "To remove: crontab -r"
}

# Main
main() {
    local command="${1:-backup}"
    
    case "$command" in
        backup)
            create_backup
            ;;
        backup-folder)
            create_folder_backup
            ;;
        restore)
            restore_backup "${2:-}"
            ;;
        list)
            list_backups
            ;;
        prune)
            prune_backups "${2:-}"
            ;;
        cron)
            setup_cron
            ;;
        *)
            echo "Usage: $0 {backup|backup-folder|restore|list|prune|cron}"
            exit 1
            ;;
    esac
}

main "$@"