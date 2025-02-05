import { Module } from '@nestjs/common';
import { CommonModule } from '@my/common';
import { HttpModule } from '@nestjs/axios';
import { BotController } from './bot.controller';
import { TelegramService } from './telegram.service';

@Module({
  imports: [CommonModule, HttpModule],
  controllers: [BotController],
  providers: [TelegramService],
})
export class BotModule {}
