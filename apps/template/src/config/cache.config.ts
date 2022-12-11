import { registerAs } from '@nestjs/config';
import { env } from './environment';
// import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

const options: RedisClientOptions = {
  // isGlobal: true,
  // store: redisStore,
  url: env.REDIS_URL || 'redis://localhost:6379',
  // ttl: Number(env.CACHE_TTL) || 5,
  /*
  secret: env.SECRET_KEY || 'sniky pink panter',
  redisConnectTimeout: env.REDIS_CONNECT_TIMEOUT,
  redisRetryAttempts: env.REDIS_RETRY_ATTEMPTS,
  redisRetryDelay: env.REDIS_RETRY_DELAY,
  redisUrl: env.REDIS_URL,
  */
};

export default registerAs('cache', () => options);
