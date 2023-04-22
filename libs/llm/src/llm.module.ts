import { Module, DynamicModule } from '@nestjs/common';
import { LLMService } from './llm.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LLMConfig } from './llm.dto';

@Module({
  providers: [LLMService],
  exports: [LLMService],
})
export class LLMModule {
  public static forRootAsync(options: Record<string, any>): DynamicModule {
    return {
      module: LLMModule,
      exports: [LLMService],
      providers: [
        LLMService,
        {
          inject: options.inject,
          provide: 'MY_LLM_OPTIONS',
          useFactory: options.useFactory,
        },
        {
          inject: ['MY_LLM_OPTIONS'],
          provide: 'LLM_TOKEN',
          useFactory: async (httpService: HttpService, options: LLMConfig) => {
            return new LLMService(httpService, options);
          },
        },
      ],
    };
  }
}
