import { Inject, Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private cacheKey = 'webapp';

  constructor(
    // private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  /**
   * Set cached value
   *
   * @param key
   * @param value
   */
  async set(key: string, value: any, options?: {
    ttl: number
  }) {
    const cacheKeyFull = `${this.cacheKey}.${key}`;
    try {
      await this.cacheManager.set(cacheKeyFull, value, {
        // ttl: 86400, // 24h
        // ttl: 3600 // 1h
        ttl: options?.ttl || 60, // 1m
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Get cached value
   *
   * @param key
   * @returns
   */
  async get(key: string) {
    const cacheKeyFull = `${this.cacheKey}.${key}`;
    try {
      const value = await this.cacheManager.get(cacheKeyFull);
      return value;
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Clean cached values.
   * If key not provided will attempt to delete all related keys.
   *
   * @param key
   * @see https://redis.io/docs/latest/commands/del/
   */
  async del(key?: string) {
    if (!key) {
      return await this.cacheManager.reset();
    }

    const cacheKeyFull = `${this.cacheKey}.${key}`;;
    await this.cacheManager.del(cacheKeyFull);
  }

}
