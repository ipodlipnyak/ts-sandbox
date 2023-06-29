import { Test, TestingModule } from '@nestjs/testing';
import { LLMService } from './llm.service';
import { HttpService } from '@nestjs/axios';

describe('LLMService', () => {
  let service: LLMService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpService,
        LLMService,
        {
          provide: 'MY_LLM_OPTIONS',
          useValue: [],
        },
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: '',
        }
      ],
    }).compile();

    service = await module.resolve<LLMService>(LLMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
