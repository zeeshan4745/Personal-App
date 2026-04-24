import axios from 'axios';
import { env } from '../../config/env.js';
import { logTelemetry } from '../../lib/logger.js';
import type { TrendQueryInput, TrendRecord } from './types.js';

const YOUTUBE_SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos';

function calcTrendScore(viewCount: number, likeCount: number, commentCount: number): number {
  const engagement = viewCount > 0 ? (likeCount + commentCount * 2) / viewCount : 0;
  return Number((Math.log10(viewCount + 1) * 0.7 + engagement * 300).toFixed(4));
}

export async function fetchYoutubeTrends(input: TrendQueryInput): Promise<TrendRecord[]> {
  const maxResults = input.maxResults ?? env.YOUTUBE_MAX_RESULTS;

  const searchResponse = await axios.get(YOUTUBE_SEARCH_ENDPOINT, {
    params: {
      part: 'snippet',
      q: input.keyword,
      type: 'video',
      order: 'viewCount',
      regionCode: env.YOUTUBE_REGION_CODE,
      maxResults,
      key: env.YOUTUBE_API_KEY
    }
  });

  const videoIds = (searchResponse.data.items ?? [])
    .map((item: any) => item.id?.videoId)
    .filter(Boolean)
    .join(',');

  if (!videoIds) {
    return [];
  }

  const statsResponse = await axios.get(YOUTUBE_VIDEOS_ENDPOINT, {
    params: {
      part: 'statistics,snippet',
      id: videoIds,
      key: env.YOUTUBE_API_KEY
    }
  });

  const trends: TrendRecord[] = (statsResponse.data.items ?? []).map((item: any) => {
    const viewCount = Number(item.statistics?.viewCount ?? 0);
    const likeCount = Number(item.statistics?.likeCount ?? 0);
    const commentCount = Number(item.statistics?.commentCount ?? 0);
    const engagementRate = viewCount > 0 ? (likeCount + commentCount) / viewCount : 0;

    return {
      platform: 'youtube',
      externalId: item.id,
      title: item.snippet?.title ?? 'Untitled',
      channelName: item.snippet?.channelTitle,
      description: item.snippet?.description,
      publishedAt: item.snippet?.publishedAt,
      viewCount,
      likeCount,
      commentCount,
      engagementRate,
      trendScore: calcTrendScore(viewCount, likeCount, commentCount),
      rawPayload: item
    };
  });

  logTelemetry('trend.discovery.youtube.completed', {
    keyword: input.keyword,
    resultCount: trends.length
  });

  return trends.sort((a, b) => b.trendScore - a.trendScore);
}
