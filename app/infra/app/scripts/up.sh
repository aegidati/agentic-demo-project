#!/usr/bin/env bash
set -euo pipefail

# up.sh - Start PostgreSQL container in detached mode
# Run from app/infra directory

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR" || exit 1

echo "Starting PostgreSQL container..."
docker-compose up -d

echo "Waiting for PostgreSQL to be ready..."
sleep 3

if docker-compose exec -T postgres pg_isready -U "${POSTGRES_USER:-app}" >/dev/null 2>&1; then
  echo "✓ PostgreSQL is ready"
  docker-compose ps
else
  echo "✗ PostgreSQL did not start properly; check logs with: docker-compose logs"
  exit 1
fi
