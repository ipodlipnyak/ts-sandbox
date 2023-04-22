import { Module, DynamicModule } from '@nestjs/common';
import { GoogleService } from './google.service';

@Module({
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
