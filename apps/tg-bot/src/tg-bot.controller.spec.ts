import { Test, TestingModule } from '@nestjs/testing';
import { TgBotController } from './tg-bot.controller';
import { TgBotService } from './tg-bot.service';

describe('TgBotController', () => {
  let tgBotController: TgBotController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TgBotController],
      providers: [TgBotService],
    }).compile();

    tgBotController = app.get<TgBotController>(TgBotController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tgBotController.getHello()).toBe('Hello World!');
    });
  });
});
