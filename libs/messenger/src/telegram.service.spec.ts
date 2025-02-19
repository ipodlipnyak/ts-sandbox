import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { HttpService } from '@nestjs/axios';
import { CryptoService } from '@my/common/services';
import { ConfigService } from '@nestjs/config';
import { CommonModule, entities, TelegramMessageDto, TelegramUsers, Users } from '@my/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockTypeORM } from 'mock-typeorm';
import {dataSource} from '@my/common';
import { optionsTest } from '@my/common/config/db.config';
import { Repository } from 'typeorm';
import * as sinon from 'sinon';

describe('TelegramService', () => {
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
  let mockUser = {
    firstName: 'test user first name',
    lastName: 'test user last name',
    email: 'test@email.com',
  };
  let typeorm: MockTypeORM;
  let usersRepository: Repository<Users>;
  let telegramUsersRepository: Repository<TelegramUsers>;

  let configService: ConfigService;
  let httpService: HttpService;
  let cryptoSerivce: CryptoService;

  afterEach(() => {
    typeorm.restore();
  });

  beforeEach(async () => {
    typeorm = new MockTypeORM();
    usersRepository = dataSource.getRepository(Users);
    telegramUsersRepository = dataSource.getRepository(TelegramUsers);

    configService = sinon.createStubInstance(ConfigService, {
      get: () => 'test config',
    });
    httpService = sinon.createStubInstance(HttpService);

    cryptoSerivce = sinon.createStubInstance(CryptoService, {
      encrypt: new Promise((resolve) => {
        setTimeout(() => {
          resolve('test encrypt');
        });
      }),
      decrypt: new Promise((resolve) => {
        setTimeout(() => {
          resolve(JSON.stringify(testMessage));
        });
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TelegramService,
          useFactory: () => {
            return new TelegramService(configService, httpService, cryptoSerivce, usersRepository, telegramUsersRepository);
          },
        },
      ],
    }).compile();

    service = await module.resolve(TelegramService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it(('generate token'), async () => {
    const token = await service.generateBindToken(testMessage, mockUser.email);
    console.log(token);
  });

  it(('execute token'), async () => {
    await service.executeBindToken('test');
  });
});
