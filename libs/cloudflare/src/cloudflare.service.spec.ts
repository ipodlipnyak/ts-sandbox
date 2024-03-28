import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareService } from './cloudflare.service';

describe('CloudflareService', () => {
  let service: CloudflareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudflareService,
        {
          provide: 'MY_CLOUDFLARE_OPTIONS',
          useValue: [],
        },
      ],
    }).compile();

    service = await module.resolve<CloudflareService>(CloudflareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
