import { Module } from '@nestjs/common';
import { CommonModule } from '@my/common';
import { HttpModule } from '@nestjs/axios';
import { TgBotController } from './tg-bot.controller';
import { TgBotService } from './tg-bot.service';

@Module({
  imports: [CommonModule, HttpModule],
  controllers: [TgBotController],
  providers: [TgBotService],
})
export class TgBotModule {}
