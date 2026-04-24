import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

async function youtubeHello(): Promise<void> {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      q: 'hello world',
      type: 'video',
      maxResults: 1,
      key: env.YOUTUBE_API_KEY
    }
  });

  const item = response.data.items?.[0];
  logger.info('youtube_hello_ok', {
    videoId: item?.id?.videoId,
    title: item?.snippet?.title
  });
}

async function tiktokHello(): Promise<void> {
  if (!env.TIKTOK_ACCESS_TOKEN) {
    logger.warn('tiktok_hello_skipped', { reason: 'TIKTOK_ACCESS_TOKEN not set' });
    return;
  }

  const response = await axios.post(
    'https://open.tiktokapis.com/v2/research/user/info/',
    { username: 'tiktok' },
    {
      headers: {
        Authorization: `Bearer ${env.TIKTOK_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  logger.info('tiktok_hello_ok', {
    hasData: Boolean(response.data?.data)
  });
}

async function instagramHello(): Promise<void> {
  if (!env.INSTAGRAM_ACCESS_TOKEN || !env.INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    logger.warn('instagram_hello_skipped', {
      reason: 'INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID not set'
    });
    return;
  }

  const response = await axios.get(
    `https://graph.facebook.com/v23.0/${env.INSTAGRAM_BUSINESS_ACCOUNT_ID}`,
    {
      params: {
        fields: 'id,username',
        access_token: env.INSTAGRAM_ACCESS_TOKEN
      }
    }
  );

  logger.info('instagram_hello_ok', {
    id: response.data?.id,
    username: response.data?.username
  });
}

async function main(): Promise<void> {
  await youtubeHello();
  await tiktokHello();
  await instagramHello();
}

main().catch((error) => {
  logger.error('hello_apis_failed', { message: error.message, stack: error.stack });
  process.exitCode = 1;
});
