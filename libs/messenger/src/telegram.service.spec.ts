import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { HttpService } from '@nestjs/axios';
import { CryptoService } from '@my/common/services';
import { ConfigService } from '@nestjs/config';
import { TelegramMessageDto, TelegramUsers, Users } from '@my/common';
import { MockTypeORM } from 'mock-typeorm';
import {dataSource} from '@my/common';
import { Repository } from 'typeorm';
import * as sinon from 'sinon';
import { ProducerService } from './producer.service';

describe('TelegramService', () => {
  let service: TelegramService;

  let typeorm: MockTypeORM;
  let usersRepository: Repository<Users>;
  let telegramUsersRepository: Repository<TelegramUsers>;

  let configService: ConfigService;
  let httpService: HttpService;
  let cryptoSerivce: CryptoService;
  let producerService: ProducerService;

  let testUser = {
    email: 'test@email.com',
  };

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

  afterEach(() => {
    /**
     * @see https://mock-typeorm-docs.vercel.app/docs/core-concepts/advanced-mocking
     */
    typeorm.restore();
  });

  beforeEach(async () => {
    typeorm = new MockTypeORM();
    usersRepository = dataSource.getRepository(Users);
    telegramUsersRepository = dataSource.getRepository(TelegramUsers);

    configService = sinon.createStubInstance(ConfigService, {
      get: sinon.stub().returns('test-config-value'),
    });
    httpService = sinon.createStubInstance(HttpService);

    cryptoSerivce = new CryptoService(configService);
    producerService = sinon.createStubInstance(ProducerService, {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TelegramService,
          useFactory: () => {
            return new TelegramService(configService, httpService, cryptoSerivce, producerService, usersRepository, telegramUsersRepository);
          },
        },
      ],
    }).compile();

    service = await module.resolve(TelegramService);
  });

  it(('generate and execute token'), async () => {
    const testToken = await service.generateBindToken(testMessage);
    await service.executeBindToken(testToken, testUser.email);

    const createCalledOnce = (telegramUsersRepository.create as sinon.SinonSpy).calledOnce;
    expect(createCalledOnce).toBeTruthy();

    const calledWithData = (telegramUsersRepository.create as sinon.SinonSpy).calledWithMatch(sinon.match({tgChatId: testMessage.chat.id}));
    expect(calledWithData).toBeTruthy();
  });
});
