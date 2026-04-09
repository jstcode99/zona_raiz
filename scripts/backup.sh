#!/bin/bash
# PostgreSQL Backup Script with Rotation
# Usage: ./scripts/backup.sh [restore]

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-postgres}"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

backup() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting PostgreSQL backup..."
    
    local backup_file="$BACKUP_DIR/postgres_backup_$DATE.sql.gz"
    
    # Run pg_dump with compression
    pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" | \
        gzip > "$backup_file"
    
    # Verify backup
    if [ -f "$backup_file" ] && [ -s "$backup_file" ]; then
        local size=$(du -h "$backup_file" | cut -f1)
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup created: $backup_file ($size)"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Backup failed or empty"
        exit 1
    fi
    
    # Clean old backups (retention)
    find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -mtime "+$RETENTION_DAYS" -delete
    local remaining=$(find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" | wc -l)
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cleanup complete. Remaining backups: $remaining"
    
    # List current backups
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Current backups:"
    ls -lh "$BACKUP_DIR" | tail -n +2
}

restore() {
    local backup_file="$1"
    if [ -z "$backup_file" ]; then
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        echo "ERROR: Backup file not found: $backup_file"
        exit 1
    fi
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restoring from: $backup_file"
    
    gunzip -c "$backup_file" | psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB"
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restore completed"
}

list_backups() {
    echo "Available backups in $BACKUP_DIR:"
    find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -printf "%T+ %p\n" | sort -r
}

case "${1:-backup}" in
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    list)
        list_backups
        ;;
    *)
        echo "Usage: $0 {backup|restore <file>|list}"
        exit 1
        ;;
esac