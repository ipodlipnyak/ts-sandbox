import { Module } from '@nestjs/common';
import { CommonModule } from '@my/common';
import { BotController } from './bot.controller';
import { TelegramService } from '@my/messenger/telegram.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CommonModule, HttpModule],
  controllers: [BotController],
  providers: [TelegramService],
})
export class BotModule {}
