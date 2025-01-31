import { Controller, Get } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';

@Controller()
export class TgBotController {
  constructor(private readonly tgBotService: TgBotService) {}

  @Get()
  getHello(): string {
    return this.tgBotService.getHello();
  }
}
