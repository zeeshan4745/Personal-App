#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/{config,lib,services/trends,scripts} db docs scripts .github/ISSUE_TEMPLATE

echo "Scaffold ensured:"
printf '%s\n' \
  "src/config" \
  "src/lib" \
  "src/services/trends" \
  "src/scripts" \
  "db" \
  "docs" \
  "scripts" \
  ".github/ISSUE_TEMPLATE"
