export type TrendPlatform = 'youtube' | 'tiktok';

export interface TrendRecord {
  platform: TrendPlatform;
  externalId: string;
  title: string;
  channelName?: string;
  description?: string;
  publishedAt?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  engagementRate?: number;
  trendScore: number;
  rawPayload: unknown;
}

export interface TrendQueryInput {
  keyword: string;
  maxResults?: number;
}
