#!/usr/bin/env bash
set -euo pipefail

# validate.sh - Validate OpenAPI specification
# Run from app/contracts directory or adjust SCRIPT_DIR as needed

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
OPENAPI_FILE="$APP_DIR/openapi/openapi.yaml"

if [ ! -f "$OPENAPI_FILE" ]; then
  echo "✗ OpenAPI file not found: $OPENAPI_FILE"
  exit 1
fi

echo "Validating OpenAPI spec: $OPENAPI_FILE"

# Try to use npx @redocly/cli if available
if command -v npx &> /dev/null || command -v node &> /dev/null; then
  echo "Using @redocly/cli for validation..."
  if npx --yes @redocly/cli lint "$OPENAPI_FILE" 2>/dev/null; then
    echo "✓ OpenAPI spec is valid"
    exit 0
  else
    echo "✗ OpenAPI validation failed (redocly)"
    exit 1
  fi
fi

# Fallback: basic YAML syntax check (if yq is available)
if command -v yq &> /dev/null; then
  echo "Using yq for basic YAML validation..."
  if yq eval '.' "$OPENAPI_FILE" > /dev/null 2>&1; then
    echo "✓ OpenAPI file has valid YAML syntax"
    exit 0
  else
    echo "✗ OpenAPI file has invalid YAML syntax"
    exit 1
  fi
fi

# Last resort: basic grep check for openapi version
if grep -q "^openapi:" "$OPENAPI_FILE" 2>/dev/null; then
  echo "✓ OpenAPI file contains required 'openapi:' field (basic check)"
  exit 0
else
  echo "✗ OpenAPI file does not contain 'openapi:' version field"
  exit 1
fi
