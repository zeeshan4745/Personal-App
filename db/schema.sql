-- Initial PostgreSQL schema for Personal-App
-- Apply with: psql "$DATABASE_URL" -f db/schema.sql

create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  niche text not null,
  language_code text not null default 'en',
  region_code text not null default 'US',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trend_sources (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('youtube','tiktok','instagram')),
  external_id text not null,
  channel_name text,
  title text not null,
  description text,
  published_at timestamptz,
  view_count bigint,
  like_count bigint,
  comment_count bigint,
  engagement_rate numeric(8,5),
  trend_score numeric(10,4),
  raw_payload jsonb not null,
  fetched_at timestamptz not null default now(),
  unique(platform, external_id)
);

create table if not exists video_ideas (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  source_trend_id uuid references trend_sources(id) on delete set null,
  title text not null,
  hook text,
  value_proposition text,
  cta text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists scripts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  video_idea_id uuid not null references video_ideas(id) on delete cascade,
  tone text,
  script_text text not null,
  word_count int generated always as (array_length(regexp_split_to_array(script_text, '\\s+'), 1)) stored,
  status text not null default 'generated',
  created_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  script_id uuid references scripts(id) on delete set null,
  asset_type text not null,
  storage_uri text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists render_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  script_id uuid not null references scripts(id) on delete cascade,
  status text not null default 'queued',
  output_uri text,
  provider text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists published_posts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  render_job_id uuid references render_jobs(id) on delete set null,
  platform text not null check (platform in ('youtube','instagram','tiktok')),
  platform_post_id text,
  title text,
  description text,
  publish_status text not null default 'scheduled',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists platform_metrics (
  id uuid primary key default gen_random_uuid(),
  published_post_id uuid not null references published_posts(id) on delete cascade,
  captured_at timestamptz not null default now(),
  views bigint,
  watch_time_seconds bigint,
  ctr numeric(8,5),
  likes bigint,
  comments bigint,
  shares bigint,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists telemetry_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  event_name text not null,
  event_value numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_trend_sources_platform_fetched_at
  on trend_sources(platform, fetched_at desc);
create index if not exists idx_video_ideas_project_status
  on video_ideas(project_id, status);
create index if not exists idx_scripts_project_created_at
  on scripts(project_id, created_at desc);
create index if not exists idx_published_posts_platform_status
  on published_posts(platform, publish_status);
create index if not exists idx_telemetry_events_name_created_at
  on telemetry_events(event_name, created_at desc);
