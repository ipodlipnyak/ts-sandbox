import { Test, TestingModule } from '@nestjs/testing';
import { GoogleService } from './google.service';

describe('GoogleService', () => {
  let service: GoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleService,
        {
          provide: 'MY_GOOGLE_OPTIONS',
          useValue: [],
        },
      ],
    }).compile();

    service = await module.resolve<GoogleService>(GoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
