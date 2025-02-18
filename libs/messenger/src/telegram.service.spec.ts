import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { HttpService } from '@nestjs/axios';
import { CryptoService } from '@my/common/services';
import { ConfigService } from '@nestjs/config';
import { TelegramMessageDto, Users } from '@my/common';

describe('SentryService', () => {
  let service: TelegramService;
  let testMessage: TelegramMessageDto = {
    date: '1441645532',
    message_id: '42424242',
    text: 'test message content',
    from: {
      id: '123',
      username: 'testUsername',
      last_name: 'test user last name',
      first_name: 'test user first name'
    },
    chat: {
      id: '456',
      username: 'testChatUsername',
      last_name: 'test chat last name',
      first_name: 'test chat first name',
      type: 'test chat type'
    }
  };
  let mockUser = Users.create({
    firstName: 'test user first name',
    lastName: 'test user last name',
    email: 'test@email.com',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        {
          provide: HttpService,
          useClass: class {}
        },
        {
          provide: CryptoService,
          useClass: class {}
        },
        {
          provide: ConfigService,
          useClass: class {
            get() {
              return 'test';
            }
          }
        },
      ],
    }).compile();

    service = await module.resolve(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(('generate token'), () => {
    const token = service.generateBindToken(testMessage, mockUser);
    console.log(token);
  });
});
