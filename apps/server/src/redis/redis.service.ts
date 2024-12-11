// src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  // On module initialization, we create the Redis client
  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost', // Redis host (default is localhost)
      port: 6379, // Redis port (default is 6379)
    });

    // Optionally, set up event listeners
    this.client.on('connect', () => {
      console.log('Redis connected!');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  getClient() {
    return this.client;
  }

  // On module destruction, we close the Redis connection
  onModuleDestroy() {
    this.client.disconnect();
  }

  // Set a key-value pair in Redis
  async set(key: string, value: string, ttl?: number) {
    await this.client.set(key, value, 'EX', ttl || 0);
  }

  // Get a value by key from Redis
  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    return value;
  }

  // Delete a key from Redis
  async del(key: string) {
    await this.client.del(key);
    console.log(`Deleted key ${key}`);
  }

  // Example of using Redis hash (if needed)
  async hset(hash: string, key: string, value: string) {
    await this.client.hset(hash, key, value);
    console.log(`Set hash ${hash} with key ${key} and value ${value}`);
  }

  async hget(hash: string, key: string): Promise<string | null> {
    const value = await this.client.hget(hash, key);
    console.log(`Got hash value for ${hash}:${key}: ${value}`);
    return value;
  }
}
