import { Test, TestingModule } from '@nestjs/testing';
import { BubblesController } from './bubbles.controller';
import { BubblesService } from './bubbles.service';

describe('BubblesController', () => {
  let bubblesController: BubblesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BubblesController],
      providers: [BubblesService],
    }).compile();

    bubblesController = app.get<BubblesController>(BubblesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bubblesController.getHello()).toBe('Hello World!');
    });
  });
});
