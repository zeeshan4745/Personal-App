import { fetchYoutubeTrends } from '../services/trends/youtubeTrendService.js';
import { fetchTiktokTrends } from '../services/trends/tiktokTrendService.js';
import { logger, logTelemetry } from '../lib/logger.js';

const keyword = process.argv[2] ?? 'personal finance';

async function main(): Promise<void> {
  const [youtube, tiktok] = await Promise.all([
    fetchYoutubeTrends({ keyword, maxResults: 10 }),
    fetchTiktokTrends({ keyword, maxResults: 10 })
  ]);

  const allTrends = [...youtube, ...tiktok];

  logTelemetry('trend.discovery.batch.completed', {
    keyword,
    youtubeCount: youtube.length,
    tiktokCount: tiktok.length,
    total: allTrends.length
  });

  logger.info('trend_discovery_output_preview', {
    keyword,
    total: allTrends.length,
    top5: allTrends.slice(0, 5).map((trend) => ({
      platform: trend.platform,
      externalId: trend.externalId,
      title: trend.title,
      trendScore: trend.trendScore
    }))
  });
}

main().catch((error) => {
  logger.error('trend_discovery_failed', { message: error.message, stack: error.stack });
  process.exitCode = 1;
});
