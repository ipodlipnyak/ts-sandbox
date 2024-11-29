import { Module, DynamicModule } from '@nestjs/common';
import { LLMService } from './llm.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LLMConfig } from './llm.dto';

export interface LLMAsyncOptions {
  imports?: any[];
  useFactory?: (...args: any[]) => Promise<LLMConfig> | LLMConfig;
  inject?: any[];
}

@Module({
  providers: [LLMService],
  exports: [LLMService],
})
export class LLMModule {
  public static forRootAsync(options: LLMAsyncOptions): DynamicModule {
    return {
      imports: [
        HttpModule,
        ConfigModule,
      ],
      module: LLMModule,
      exports: [LLMService],
      providers: [
        LLMService,
        {
          inject: options.inject,
          provide: 'MY_LLM_OPTIONS',
          useFactory: options.useFactory,
        },
      ],
    };
  }
}
