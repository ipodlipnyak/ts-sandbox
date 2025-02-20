import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { load } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { services } from './services';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { commands } from './commands';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('cache'),
        isGlobal: true,
        store: redisStore,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('db'),
      }),
    }),
  ],
  providers: [...services, Logger, ...commands],
  exports: [...services, Logger, ...commands],
})
export class CommonModule { }
