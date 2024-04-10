import { Module, DynamicModule } from '@nestjs/common';
import { GoogleService } from './google.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { AppModule } from 'apps/template/src/app.module';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

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
  ],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {
  public static forRootAsync(options: Record<string, any>): DynamicModule {
    return {
      module: GoogleModule,
      exports: [GoogleService],
      providers: [
        GoogleService,
        {
          inject: options.inject,
          provide: 'MY_GOOGLE_OPTIONS',
          useFactory: options.useFactory,
        },
        {
          inject: ['MY_GOOGLE_OPTIONS'],
          provide: 'GOOGLE_TOKEN',
          useFactory: async (options: Record<string, any>) => {
            return new GoogleService(options);
          },
        },
      ],
    };
  }
}
