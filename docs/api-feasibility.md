# API Feasibility Notes (checked on 2026-04-24 UTC)

## YouTube Data API quota reality
- Default project allocation is **10,000 units/day**.
- `search.list` calls cost **100 units/request**.
- `videos.list` calls typically cost **1 unit/request**.

### Impact on trend discovery design
If each keyword run uses 1 `search.list` + 1 `videos.list`, cost is ~101 units per keyword batch.
At 10,000 units/day, this supports roughly 99 such batches/day before quota exhaustion.

## TikTok for Developers limits
TikTok publishes per-endpoint rate limits for selected APIs using a sliding 1-minute window (example defaults shown in docs):
- `/v2/user/info/`: 600 requests/minute
- `/v2/video/query/`: 600 requests/minute
- `/v2/video/list/`: 600 requests/minute

For Research APIs, TikTok docs also mention separate daily quotas for approved research use cases.

## Feasibility decisions captured in scaffold
1. Trend-discovery service caps requested result size and supports per-run keyword batching.
2. `helloWorldApis.ts` provides the minimal auth/data smoke checks before deeper feature work.
3. Telemetry events are logged so we can measure request volume and tune scheduling before quota overruns.
4. Backlog includes separate quota-aware ingestion jobs rather than ad hoc runtime API fan-out.

## Operator checklist before production
- Verify actual quota assigned in Google Cloud Console for the specific project.
- Confirm TikTok app product approvals and scopes for the exact endpoints being used.
- Add a daily quota budget guard (stop or degrade when >80% spent).
- Record platform `429` and auth errors in telemetry for alerting.
