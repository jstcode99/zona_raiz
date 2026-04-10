#!/usr/bin/env bash
set -euo pipefail

# -------------------------------------------------
# Helper script to manage the self‑hosted Supabase stack
# -------------------------------------------------
# Usage:
#   ./scripts/supabase-up.sh generate-keys   # create JWT/ANON keys (writes to .env.supabase.local)
#   ./scripts/supabase-up.sh start           # bring up all Supabase services
#   ./scripts/supabase-up.sh stop            # stop the stack
#   ./scripts/supabase-up.sh status          # show container status
# -------------------------------------------------

COMPOSE_FILE="docker-compose.supabase.yml"
ENV_FILE=".env.supabase.local"

# -----------------------------------------------------------------
# Helper: ensure .env file exists
# -----------------------------------------------------------------
ensure_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    echo "⚠️  $ENV_FILE not found – copying template..."
    cp .env.supabase "$ENV_FILE"
    echo "✏️  Edit $ENV_FILE and set your secrets before continuing."
    exit 1
  fi
}

# -----------------------------------------------------------------
# Generate JWT secret + anon / service‑role keys (one‑time)
# -----------------------------------------------------------------
generate_keys() {
  echo "🔑 Generating Supabase keys..."

  # JWT secret (32‑byte base64)
  JWT_SECRET=$(openssl rand -base64 32)
  # Anon key (32‑byte base64)
  ANON_KEY=$(openssl rand -base64 32)
  # Service‑role key (32‑byte base64)
  SERVICE_ROLE_KEY=$(openssl rand -base64 32)

  # Write (or replace) the variables in the .env file
  {
    echo "SUPABASE_JWT_SECRET=$JWT_SECRET"
    echo "SUPABASE_ANON_KEY=$ANON_KEY"
    echo "SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
  } >> "$ENV_FILE"

  echo "✅ Keys added to $ENV_FILE"
  echo "   • SUPABASE_JWT_SECRET"
  echo "   • SUPABASE_ANON_KEY"
  echo "   • SUPABASE_SERVICE_ROLE_KEY"
}

# -----------------------------------------------------------------
# Start the stack
# -----------------------------------------------------------------
start_stack() {
  ensure_env

  echo "🚀 Starting Supabase stack (docker‑compose)…"
  docker compose -f "$COMPOSE_FILE" up -d

  echo "⏳ Waiting for PostgreSQL to become ready…"
  # Simple wait‑loop (max 30 s)
  for i in {1..30}; do
    if docker exec supabase_db_zona_raiz pg_isready -U postgres >/dev/null 2>&1; then
      echo "✅ PostgreSQL is ready"
      break
    fi
    sleep 1
  done

  echo "🔧 Running Supabase migrations (supabase db push)…"
  # The supabase CLI must be installed on the host; if not, skip this step.
  if command -v supabase >/dev/null 2>&1; then
    supabase db push --project-id local
  else
    echo "⚠️  supabase CLI not installed – skipping migrations."
  fi

  echo "✅ Supabase stack is up."
}

# -----------------------------------------------------------------
# Stop the stack
# -----------------------------------------------------------------
stop_stack() {
  echo "🛑 Stopping Supabase stack…"
  docker compose -f "$COMPOSE_FILE" down
  echo "✅ Stopped."
}

# -----------------------------------------------------------------
# Show status
# -----------------------------------------------------------------
status_stack() {
  docker compose -f "$COMPOSE_FILE" ps
}

# -----------------------------------------------------------------
# Main dispatcher
# -----------------------------------------------------------------
case "${1:-}" in
  generate-keys) generate_keys ;;
  start)          start_stack ;;
  stop)           stop_stack ;;
  status)         status_stack ;;
  *)
    echo "Usage: $0 {generate-keys|start|stop|status}"
    exit 1
    ;;
esac
