#!/usr/bin/env bash
set -euo pipefail

# down.sh - Stop PostgreSQL container
# Run from app/infra directory

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR" || exit 1

echo "Stopping PostgreSQL container..."
docker-compose down

echo "✓ PostgreSQL container stopped"
