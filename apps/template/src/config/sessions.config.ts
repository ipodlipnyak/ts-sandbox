import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('sessions', () => {
  return {
    adminPassword: env.ADMIN_PASSWORD || 'test',
    secret: env.SECRET_KEY || 'sniky pink panter',
    redisConnectTimeout: env.REDIS_CONNECT_TIMEOUT,
    redisRetryAttempts: env.REDIS_RETRY_ATTEMPTS,
    redisRetryDelay: env.REDIS_RETRY_DELAY,
    redisUrl: env.REDIS_URL || 'redis://localhost:6379',
  };
});
