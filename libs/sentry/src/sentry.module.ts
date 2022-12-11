import { Module, DynamicModule } from '@nestjs/common';
import { SentryService } from './sentry.service';

@Module({})
export class SentryModule {
  public static forRootAsync(options: Record<string, any>): DynamicModule {
    return {
      module: SentryModule,
      exports: [SentryService],
      providers: [
        SentryService,
        {
          inject: options.inject,
          provide: 'MY_SENTRY_OPTIONS',
          useFactory: options.useFactory,
        },
        {
          inject: ['MY_SENTRY_OPTIONS'],
          provide: 'SENTRY_TOKEN',
          useFactory: async (options: Record<string, any>) => {
            return new SentryService(options);
          },
        },
      ],
    };
  }
}
