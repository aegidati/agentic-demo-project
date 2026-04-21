#!/usr/bin/env sh
set -eu

AUDIT_FILE_PATH="${IAM_AUDIT_FILE_PATH:-/var/lib/app/audit/events.ndjson}"

if [ -f "$AUDIT_FILE_PATH" ]; then
  rm -f "$AUDIT_FILE_PATH"
fi

echo "Audit store reset at $AUDIT_FILE_PATH"
