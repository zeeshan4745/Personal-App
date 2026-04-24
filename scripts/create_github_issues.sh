#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required to sync backlog issues."
  exit 1
fi

while IFS='|' read -r title body; do
  [[ -z "${title}" ]] && continue
  gh issue create --title "$title" --body "$body"
done <<'BACKLOG'
Initialize backend service|Create API service bootstrap, config loading, and health endpoint.
Add YouTube trend ingestion job|Implement a scheduled worker that fetches trend data and stores trend_sources rows.
Add script generation endpoint|Create endpoint for generating script drafts from trend-backed ideas.
Implement FFmpeg rendering worker|Queue-based rendering worker for short and long video formats.
Add OAuth publishing adapters|Connect YouTube and Instagram publish flows with encrypted token handling.
Add analytics ingestion jobs|Ingest watch/engagement metrics and map to platform_metrics table.
BACKLOG
