import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  YOUTUBE_API_KEY: z.string().min(1),
  YOUTUBE_REGION_CODE: z.string().default('US'),
  YOUTUBE_MAX_RESULTS: z.coerce.number().int().min(1).max(50).default(25),
  TIKTOK_ACCESS_TOKEN: z.string().optional(),
  INSTAGRAM_ACCESS_TOKEN: z.string().optional(),
  INSTAGRAM_BUSINESS_ACCOUNT_ID: z.string().optional(),
  LOG_LEVEL: z.string().default('info')
});

export const env = envSchema.parse(process.env);
