#!/usr/bin/env sh
set -eu

AUDIT_FILE_PATH="${IAM_AUDIT_FILE_PATH:-/var/lib/app/audit/events.ndjson}"
AUDIT_DIR="$(dirname "$AUDIT_FILE_PATH")"

mkdir -p "$AUDIT_DIR"
if [ ! -f "$AUDIT_FILE_PATH" ]; then
  : > "$AUDIT_FILE_PATH"
fi

echo "Audit store initialized at $AUDIT_FILE_PATH"
