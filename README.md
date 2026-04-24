# Personal-App

An AI-assisted content automation platform that helps creators:
- discover high-performing video ideas,
- generate original scripts inspired by proven formats,
- create short-form and long-form videos,
- and publish to multiple monetization platforms (YouTube, Instagram, TikTok, etc.) with analytics feedback.

## Vision
Build a **creator co-pilot**, not a spam bot:
- Use trend intelligence to identify opportunities.
- Produce unique, brand-safe content.
- Keep a human in the loop for approvals.
- Respect each platform's API, terms, and copyright requirements.

## Core Features

### 1) Trend Discovery (YouTube-first)
- Query YouTube content by niche, language, region, and recency.
- Rank candidate videos using a weighted score:
  - views,
  - engagement rate (likes/comments per view),
  - upload recency,
  - channel growth signals.
- Extract metadata and transcript signals:
  - title patterns,
  - hook styles,
  - pacing and segment structure,
  - common keywords/tags.

### 2) Similar-but-Original Content Generation
- Generate video ideas from discovered trends.
- Build script outlines:
  - Hook
  - Problem/Promise
  - Main value points
  - CTA
- Generate full scripts in configurable tones (educational, story, hype, etc.).
- Add plagiarism/copyright safeguards:
  - semantic similarity threshold checks,
  - banned phrase lists,
  - source attribution for factual claims.

### 3) Automated Video Creation
- Convert scripts to voiceover (TTS or recorded voice).
- Assemble visuals from:
  - stock assets,
  - user media,
  - AI-generated B-roll/prompts.
- Auto-generate captions/subtitles and emojis.
- Export platform-specific variants:
  - Shorts/Reels/TikTok (9:16),
  - YouTube long-form (16:9).

### 4) Cross-Platform Publishing
- Connect social accounts securely with OAuth.
- Schedule and publish with platform-specific metadata templates.
- Auto-create:
  - titles,
  - descriptions,
  - tags/hashtags,
  - thumbnail text suggestions.
- Retry/error workflows for failed uploads.

### 5) Analytics and Learning Loop
- Pull post-performance data:
  - watch time,
  - retention,
  - CTR,
  - engagement.
- Compare generated ideas vs performance outcomes.
- Recommend next scripts based on winning patterns.

## Suggested Technical Architecture

### Backend
- **API**: FastAPI (Python) or NestJS (TypeScript)
- **Queue/Workers**: Celery/RQ (Python) or BullMQ (Node)
- **DB**: PostgreSQL for app data + Redis for jobs/cache
- **Storage**: S3-compatible object storage for media assets
- **Transcoding**: FFmpeg pipelines for rendering and format conversion

### AI/ML Layer
- Trend scorer service (feature engineering + ranking)
- Script generation service (LLM prompt chains + guardrails)
- Voice and subtitle service
- Compliance service (copyright similarity + policy checks)

### Integrations
- YouTube Data API
- Instagram Graph API
- TikTok API (if available for publishing in your region/account type)
- Optional affiliate network APIs / product feed APIs for monetization workflows

## Data Model (High-Level)
- `projects`
- `trend_sources`
- `video_ideas`
- `scripts`
- `media_assets`
- `render_jobs`
- `published_posts`
- `platform_metrics`

## MVP Roadmap (8–12 Weeks)

### Phase 1: Discovery + Scripting
- YouTube trend search and scoring
- Script generation with templates
- Manual review UI

### Phase 2: Video Builder
- TTS + subtitle pipeline
- FFmpeg scene assembly
- One-click draft export

### Phase 3: Publishing
- YouTube + Instagram scheduling/publishing
- Basic upload status dashboard

### Phase 4: Optimization
- Metrics ingestion
- “Generate next best 10 ideas” recommender

## Compliance, Legal, and Platform Safety
- Do not scrape where official APIs are required.
- Respect copyright and avoid near-duplicate content.
- Label sponsored/affiliate content where required.
- Keep manual approval before final publishing.
- Store OAuth tokens encrypted at rest.

## Example User Flow
1. User selects niche: “personal finance for students”.
2. System fetches top recent YouTube videos and ranks patterns.
3. User gets 20 original video ideas + chooses 3.
4. App generates scripts, voiceover, visuals, and captions.
5. User reviews and edits.
6. App schedules posts to YouTube + Instagram.
7. App analyzes metrics and suggests next iteration.

## Current Scaffold (implemented)
- Environment scaffolding script: `scripts/init_scaffold.sh`
- TypeScript project setup: `package.json`, `tsconfig.json`
- Initial DB schema: `db/schema.sql`
- Trend discovery services: `src/services/trends/*`
- API smoke test script: `src/scripts/helloWorldApis.ts`
- Trend engine runner: `src/scripts/runTrendDiscovery.ts`
- Telemetry logger: `src/lib/logger.ts`
- Backlog sync assets: `docs/backlog.md`, `scripts/create_github_issues.sh`
- API feasibility notes with quota assumptions: `docs/api-feasibility.md`

## Next Build Steps
1. Initialize backend service and PostgreSQL schema.
2. Add YouTube trend-ingestion job.
3. Add script generation endpoint with prompt templates.
4. Implement FFmpeg rendering worker.
5. Add OAuth and publishing adapters for YouTube/Instagram.
6. Add analytics ingestion jobs and dashboard.
