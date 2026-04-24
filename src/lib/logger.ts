import winston from 'winston';
import { env } from '../config/env.js';

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'personal-app' },
  transports: [new winston.transports.Console()]
});

export function logTelemetry(eventName: string, metadata: Record<string, unknown>): void {
  logger.info('telemetry_event', { eventName, metadata });
}
