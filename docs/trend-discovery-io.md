# Trend Discovery Engine: Input/Output Mapping

## Input Contract
The trend discovery service accepts:

```json
{
  "keyword": "personal finance",
  "maxResults": 10
}
```

Fields:
- `keyword` (string, required): search term used for platform APIs.
- `maxResults` (number, optional): bounded by API constraints.

## Runtime Flow
1. Query YouTube and TikTok trend endpoints.
2. Normalize records into a shared `TrendRecord` shape.
3. Calculate `engagementRate` and `trendScore`.
4. Persist normalized records into `trend_sources`.
5. Link candidate ideas in `video_ideas.source_trend_id` for script generation.

## Database Mapping
`TrendRecord` maps to `trend_sources`:
- `platform` -> `platform`
- `externalId` -> `external_id`
- `channelName` -> `channel_name`
- `title` -> `title`
- `description` -> `description`
- `publishedAt` -> `published_at`
- `viewCount` -> `view_count`
- `likeCount` -> `like_count`
- `commentCount` -> `comment_count`
- `engagementRate` -> `engagement_rate`
- `trendScore` -> `trend_score`
- `rawPayload` -> `raw_payload`

## Hand-off to Script Generation
Script generation should only read ideas where:
- `video_ideas.status = 'draft'`, and
- `video_ideas.source_trend_id` references a `trend_sources` row with populated `trend_score`.

Recommended query shape:
```sql
select vi.id, vi.title, ts.platform, ts.trend_score, ts.title as source_title
from video_ideas vi
join trend_sources ts on ts.id = vi.source_trend_id
where vi.project_id = $1
order by ts.trend_score desc
limit 20;
```
