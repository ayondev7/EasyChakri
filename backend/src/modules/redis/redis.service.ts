import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { createHash } from 'crypto';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private readonly defaultTTL = 300;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('UPSTASH_REDIS_REST_URL');
    const redisToken = this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN');

    if (!redisUrl || !redisToken) {
      throw new Error('Redis configuration missing');
    }

    const url = new URL(redisUrl);
    
    this.client = new Redis({
      host: url.hostname,
      port: parseInt(url.port) || 6379,
      password: redisToken,
      tls: url.protocol === 'https:' ? {} : undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const expiryTime = ttl || this.defaultTTL;
      await this.client.setex(key, expiryTime, serialized);
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
    }
  }

  async getWithRefresh<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    staleTime?: number,
  ): Promise<T> {
    try {
      const value = await this.client.get(key);
      
      if (!value) {
        const fresh = await fetchFn();
        await this.set(key, fresh, ttl);
        return fresh;
      }

      const data = JSON.parse(value);
      const cacheTtl = await this.ttl(key);
      const effectiveStaleTime = staleTime || Math.floor((ttl || this.defaultTTL) / 2);

      if (cacheTtl > 0 && cacheTtl < effectiveStaleTime) {
        setImmediate(async () => {
          try {
            const fresh = await fetchFn();
            await this.set(key, fresh, ttl);
          } catch (err) {
            this.logger.error(`Background refresh failed for key ${key}:`, err);
          }
        });
      }

      return data;
    } catch (error) {
      this.logger.error(`Error in getWithRefresh for key ${key}:`, error);
      return await fetchFn();
    }
  }

  async setWithMetadata(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const metadata = {
        data: value,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
      };
      const serialized = JSON.stringify(metadata);
      const expiryTime = ttl || this.defaultTTL;
      await this.client.setex(key, expiryTime, serialized);
    } catch (error) {
      this.logger.error(`Error setting key with metadata ${key}:`, error);
    }
  }

  async getWithMetadata<T>(key: string): Promise<{ data: T; timestamp: number; ttl: number } | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (error) {
      this.logger.error(`Error getting key with metadata ${key}:`, error);
      return null;
    }
  }

  async del(key: string | string[]): Promise<void> {
    try {
      if (Array.isArray(key)) {
        if (key.length > 0) {
          await this.client.del(...key);
        }
      } else {
        await this.client.del(key);
      }
    } catch (error) {
      this.logger.error(`Error deleting key(s):`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting pattern ${pattern}:`, error);
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.client.expire(key, seconds);
    } catch (error) {
      this.logger.error(`Error setting expiry for key ${key}:`, error);
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}:`, error);
      return -1;
    }
  }

  generateQueryHash(query: Record<string, any>): string {
    const sorted = Object.keys(query)
      .sort()
      .reduce((acc, key) => {
        acc[key] = query[key];
        return acc;
      }, {} as Record<string, any>);
    
    return createHash('md5')
      .update(JSON.stringify(sorted))
      .digest('hex');
  }

  async checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    try {
      const current = await this.incr(key);
      
      if (current === 1) {
        await this.expire(key, windowSeconds);
      }
      
      return current <= limit;
    } catch (error) {
      this.logger.error(`Error checking rate limit for key ${key}:`, error);
      return true;
    }
  }

  async getRateLimitInfo(key: string): Promise<{ count: number; ttl: number }> {
    try {
      const value = await this.client.get(key);
      const count = value ? parseInt(value) : 0;
      const ttl = await this.ttl(key);
      return { count, ttl };
    } catch (error) {
      this.logger.error(`Error getting rate limit info for key ${key}:`, error);
      return { count: 0, ttl: -1 };
    }
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
