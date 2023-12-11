import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { redisStore } from 'cache-manager-redis-yet';

import { RedisCacheService } from '../services/redis-cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: "redis://redis:6379",
        }),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),

  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisModule { }
