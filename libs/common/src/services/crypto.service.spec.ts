import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '@my/common/services';
import { ConfigService } from '@nestjs/config';
import * as sinon from 'sinon';

describe('CrpytoService', () => {
  let service: CryptoService;

  let configService: ConfigService;

  beforeEach(async () => {
    configService = sinon.createStubInstance(ConfigService, {
      get: sinon.stub().returns('test-config-value'),
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CryptoService,
          useFactory: () => {
            return new CryptoService(configService);
          },
        },
      ],
    }).compile();

    service = await module.resolve(CryptoService);
  });

  it(('encode decode'), async () => {
    const payload = 'test payload';
    const testToken = await service.encrypt(payload);
    const extractedPaload = await service.decrypt(testToken);
    expect(testToken).not.toBe(payload);
    expect(extractedPaload).toBe(payload);
  });
});
