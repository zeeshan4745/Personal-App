import axios from 'axios';
import { env } from '../../config/env.js';
import { logTelemetry } from '../../lib/logger.js';
import type { TrendQueryInput, TrendRecord } from './types.js';

// NOTE: Endpoint availability depends on app/product approval and account type.
const TIKTOK_DISCOVERY_ENDPOINT = 'https://open.tiktokapis.com/v2/research/video/query/';

function calcTrendScore(viewCount: number, likeCount: number, commentCount: number): number {
  const engagement = viewCount > 0 ? (likeCount + commentCount * 2) / viewCount : 0;
  return Number((Math.log10(viewCount + 1) * 0.6 + engagement * 350).toFixed(4));
}

export async function fetchTiktokTrends(input: TrendQueryInput): Promise<TrendRecord[]> {
  if (!env.TIKTOK_ACCESS_TOKEN) {
    return [];
  }

  const response = await axios.post(
    TIKTOK_DISCOVERY_ENDPOINT,
    {
      query: {
        and: [
          {
            operation: 'IN',
            field_name: 'keyword',
            field_values: [input.keyword]
          }
        ]
      },
      max_count: input.maxResults ?? 20
    },
    {
      headers: {
        Authorization: `Bearer ${env.TIKTOK_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const trends: TrendRecord[] = (response.data.data?.videos ?? []).map((video: any) => {
    const viewCount = Number(video.view_count ?? 0);
    const likeCount = Number(video.like_count ?? 0);
    const commentCount = Number(video.comment_count ?? 0);

    return {
      platform: 'tiktok',
      externalId: video.id,
      title: video.video_description ?? 'Untitled',
      channelName: video.username,
      publishedAt: video.create_time,
      viewCount,
      likeCount,
      commentCount,
      engagementRate: viewCount > 0 ? (likeCount + commentCount) / viewCount : 0,
      trendScore: calcTrendScore(viewCount, likeCount, commentCount),
      rawPayload: video
    };
  });

  logTelemetry('trend.discovery.tiktok.completed', {
    keyword: input.keyword,
    resultCount: trends.length
  });

  return trends.sort((a, b) => b.trendScore - a.trendScore);
}
