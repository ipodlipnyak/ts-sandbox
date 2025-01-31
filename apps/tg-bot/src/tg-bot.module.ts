import { Module } from '@nestjs/common';
import { TgBotController } from './tg-bot.controller';
import { TgBotService } from './tg-bot.service';

@Module({
  imports: [],
  controllers: [TgBotController],
  providers: [TgBotService],
})
export class TgBotModule {}
