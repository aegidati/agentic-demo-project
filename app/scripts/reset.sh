#!/usr/bin/env bash
set -euo pipefail

# reset.sh - Stop container and remove data volume (DANGEROUS)
# Run from app/infra directory

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR" || exit 1

echo "⚠️  WARNING: This will delete all database data!"
echo "Press Ctrl+C to cancel, or wait 5 seconds to proceed..."
sleep 5

echo "Stopping and removing PostgreSQL container and volume..."
docker-compose down -v

echo "Starting fresh PostgreSQL container..."
docker-compose up -d

echo "Waiting for PostgreSQL to be ready..."
sleep 3

if docker-compose exec -T postgres pg_isready -U "${POSTGRES_USER:-app}" >/dev/null 2>&1; then
  echo "✓ PostgreSQL is ready (fresh start)"
  docker-compose ps
else
  echo "✗ PostgreSQL did not start properly"
  exit 1
fi
