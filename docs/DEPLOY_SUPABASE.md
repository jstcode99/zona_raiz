# zona_raiz — Self-Hosted Supabase Deployment Guide

Production-ready deployment guide for self-hosted Supabase stack.

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start](#2-quick-start)
3. [Configuration](#3-configuration)
4. [Generating Keys](#4-generating-keys)
5. [Starting the Stack](#5-starting-the-stack)
6. [Verifying Services](#6-verifying-services)
7. [Integrating with Next.js](#7-integrating-with-nextjs)
8. [Backup & Restore](#8-backup--restore)
9. [Production TLS](#9-production-tls)
10. [Scaling & Optimization](#10-scaling--optimization)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04+ / Debian 11+ / macOS 12+
- **RAM**: Minimum 8GB (16GB recommended for production)
- **CPU**: 4 cores minimum
- **Disk**: 50GB SSD (100GB+ recommended)

### Required Software

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version           # Docker version 24.0+
docker-compose --version  # Docker Compose version 2.24+
```

### Network Requirements

| Port | Service | Required |
|------|---------|----------|
| 5432 | PostgreSQL | Yes (for migrations/backup) |
| 8000 | Kong HTTP API | Yes (public) |
| 8443 | Kong HTTPS API | Optional (TLS) |
| 8001 | Kong Admin | Optional (internal) |
| 5050 | pgAdmin | Optional |

### DNS Configuration (Production)

For production, configure your DNS:

```
A     record  api.yourdomain.com    -> YOUR_SERVER_IP
CNAME  *.yourdomain.com  -> api.yourdomain.com
```

---

## 2. Quick Start

```bash
# 1. Clone and navigate to project
cd ~/projects/zona_raiz

# 2. Create environment file
cp .env.supabase .env.supabase.local

# 3. Generate keys
./scripts/supabase-up.sh generate-keys

# 4. Start stack
./scripts/supabase-up.sh start

# 5. Verify
curl http://localhost:8000/rest/v1/
```

Expected response:
```json
{
  "message": "Welcome to PostgREST"
}
```

---

## 3. Configuration

### Environment Variables

Copy `.env.supabase` template and configure:

```bash
cp .env.supabase .env.supabase.local
nano .env.supabase.local
```

Key variables:

| Variable | Description | Example |
|----------|------------|---------|
| `POSTGRES_PASSWORD` | Database password | `openssl rand -base64 32` |
| `GOTRUE_JWT_SECRET` | JWT signing secret | Auto-generated |
| `SUPABASE_ANON_KEY` | Public API key | Auto-generated |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key | Auto-generated |
| `KONG_HTTP_PORT` | Public API port | `8000` |
| `SITE_URL` | Your app URL | `https://yourdomain.com` |

### Production Settings

For production, update these:

```bash
# Site URL
SITE_URL=https://yourdomain.com
GOTRUE_API_EXTERNAL_URL=https://api.yourdomain.com

# Restrict CORS (edit kong/kong.yml)
origins:
  - https://yourdomain.com
  - https://www.yourdomain.com

# Enable TLS
KONG_HTTPS_PORT=8443
```

---

## 4. Generating Keys

### Method 1: Using the Setup Script (Recommended)

```bash
./scripts/supabase-up.sh generate-keys
```

### Method 2: Using OpenSSL

```bash
# JWT Secret
openssl rand -base64 32 | tr -d '\n'

# Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.$(openssl rand -base64 32 | tr -d '\n')"

# Service Role Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.$(openssl rand -base64 32 | tr -d '\n')"
```

### Method 3: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Generate keys
supabase keys create
```

---

## 5. Starting the Stack

### Initial Setup

```bash
./scripts/supabase-up.sh start
```

This script will:
1. Check prerequisites (Docker, Docker Compose)
2. Create Docker network (`supabase_network`)
3. Generate JWT/keys if not present
4. Pull required Docker images
5. Start all services
6. Wait for PostgreSQL to be ready
7. Set up auth schema
8. Run migrations
9. Display service URLs

### Start/Stop Commands

```bash
# Start stack
./scripts/supabase-up.sh start

# Stop stack (preserves data)
./scripts/supabase-up.sh stop

# Remove stack (deletes containers)
./scripts/supabase-up.sh down

# Restart stack
./scripts/supabase-up.sh restart

# View logs
./scripts/supabase-up.sh logs
./scripts/supabase-up.sh logs postgres
```

---

## 6. Verifying Services

### Check Service Status

```bash
./scripts/supabase-up.sh status
```

### Manual Verification

```bash
# Kong API Gateway
curl http://localhost:8000/
# Expected: {"kong":"3.4.x"}

# PostgREST
curl http://localhost:8000/rest/v1/
# Expected: {"message":"Welcome to PostgREST"}

# GoTrue Auth
curl http://localhost:9999/health
# Expected: {"code200":"","msg":"HEALTH"}

# Storage
curl http://localhost:5000/status
# Expected: {"status":"OK"}

# Meta (Database Management)
curl http://localhost:8080/health
# Expected: {"status":"OK"}
```

### Database Verification

```bash
# Connect to PostgreSQL
docker exec -it supabase_postgres psql -U postgres -d postgres

# Check tables
\dt

# Check auth schema
SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth';
```

---

## 7. Integrating with Next.js

### Update Environment Variables

Add to your `.env` or `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

For production:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Update TypeScript Client

Your existing `infrastructure/db/supabase.server.ts` should work automatically:

```typescript
// No changes needed - uses environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

### Test Integration

```bash
# Restart Next.js after updating .env
pnpm dev

# Test API
curl http://localhost:3000/api/properties
```

---

## 8. Backup & Restore

### Manual Backup

```bash
# Database backup
./scripts/supabase-backup.sh backup

# Full backup (database + storage)
./scripts/supabase-backup.sh backup-folder

# List backups
./scripts/supabase-backup.sh list
```

### Automated Backups (Cron)

```bash
# Setup daily backups at 2 AM
./scripts/supabase-backup.sh cron

# Prune old backups (older than 7 days)
./scripts/supabase-backup.sh prune 7
```

### Restore from Backup

```bash
# List available backups
./scripts/supabase-backup.sh list

# Restore from backup
./scripts/supabase-backup.sh restore /backups/supabase/postgres/supabase_backup_20240101_120000.sql.gz
```

### Manual Restore

```bash
# Backup current database
docker exec supabase_postgres pg_dump -U postgres -d postgres > backup_before_restore.sql

# Restore from file
gunzip -c backup_file.sql.gz | docker exec -i supabase_postgres psql -U postgres -d postgres
```

### Storage Backup

```bash
# Backup MinIO storage
docker cp supabase_storage:/var/lib/storage ./backup/storage

# Restore storage
docker cp ./backup/storage supabase_storage:/var/lib/storage
```

---

## 9. Production TLS

### Option 1: Caddy (Recommended)

```yaml
# docker-compose.tls.yml
version: '3.8'

services:
  caddy:
    image: caddy:2-alpine
    container_name: supabase_caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - kong
    networks:
      - supabase_network

volumes:
  caddy_data:

networks:
  supabase_network:
    external: true
```

```Caddyfile
# Caddyfile
api.yourdomain.com {
    reverse_proxy kong:8000
    tls admin@yourdomain.com
}
```

### Option 2: nginx-proxy with Let's Encrypt

```yaml
# docker-compose.proxy.yml
version: '3.8'

services:
  nginx-proxy:
    image: jwilder/nginx-proxy
    container_name: nginx_proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs:ro
    networks:
      - supabase_network

  letsencrypt:
    image: jrcs/letsencrypt-nginx-proxy-companion
    container_name: letsencrypt
    environment:
      - NGINX_PROXY_CONTAINER=nginx_proxy
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs:rw
    depends_on:
      - nginx-proxy
    networks:
      - supabase_network

  kong:
    environment:
      - VIRTUAL_HOST=api.yourdomain.com
      - VIRTUAL_PORT=8000
      - LETSENCRYPT_HOST=api.yourdomain.com
```

---

## 10. Scaling & Optimization

### Multiple Replicas

For high availability:

```bash
# Scale services
docker-compose -f docker-compose.supabase.yml up -d --scale postgres=2 --scale kong=3
```

### Use Managed PostgreSQL

For production, consider:

| Service | Link | Notes |
|---------|------|-------|
| Supabase Cloud | supabase.com | Managed, easy |
| Neon | neon.tech | Serverless PostgreSQL |
| Railway | railway.app | Simple deployment |
| Aiven | aiven.io | High performance |
| CloudSQL | cloud.google.com/cloudsql | GCP managed |

### Performance Tuning

```bash
# PostgreSQL - Increase shared buffers
POSTGRES_SHARED_BUFFERS=256MB

# PostgreSQL - Enable parallel queries
POSTGRES_MAX_PARALLEL_WORKERS_PER_GATHER=4

# Kong - Increase workers
KONG_WORKER_PROCESSES=auto

# MinIO - Use SSD storage
# Mount SSD at /data and configure:
# STORAGE_BACKEND_PATH=/data
```

---

## 11. Troubleshooting

### Common Issues

#### PostgreSQL Won't Start

```bash
# Check logs
docker logs supabase_postgres

# Check disk space
df -h

# Check permissions
ls -la /var/lib/postgresql
```

#### Services Can't Connect

```bash
# Check network
docker network inspect supabase_network

# Check DNS resolution
docker exec supabase_kong ping -c 3 postgres
```

#### Out of Memory

```bash
# Check memory usage
docker stats

# Increase swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### Port Already in Use

```bash
# Find process
sudo lsof -i :8000

# Stop conflicting service
sudo systemctl stop nginx
# or
sudo kill $(sudo lsof -t -i :8000)
```

### Reset Everything

```bash
# Complete reset
docker-compose -f docker-compose.supabase.yml down -v
rm -rf ./supabase_pgdata
./scripts/supabase-up.sh start
```

---

## Service URLs

| Service | Internal URL | External URL |
|---------|-------------|-------------|
| Kong | http://kong:8000 | http://localhost:8000 |
| PostgreSQL | postgres:5432 | localhost:5432 |
| GoTrue | http://gotrue:9999 | http://localhost:8000/auth/v1 |
| PostgREST | http://postgrest:3000 | http://localhost:8000/rest/v1 |
| Realtime | ws://realtime:4000 | ws://localhost:8000/realtime/v1 |
| Storage | http://storage:5000 | http://localhost:8000/storage/v1 |
| Meta | http://meta:8080 | http://localhost:8080/meta/v1 |
| pgAdmin | - | http://localhost:5050 |

---

## Quick Reference

```bash
# Start Supabase stack
./scripts/supabase-up.sh start

# Check status
./scripts/supabase-up.sh status

# View logs
./scripts/supabase-up.sh logs

# Create backup
./scripts/supabase-backup.sh backup

# Stop stack
./scripts/supabase-up.sh stop
```