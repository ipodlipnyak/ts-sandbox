import { Module } from '@nestjs/common';
import { CommonModule, telegramUsersProvider, usersProvider } from '@my/common';
import { BotController } from './bot.controller';
import { TelegramService } from '@my/messenger/telegram.service';
import { HttpModule } from '@nestjs/axios';
import { dataSourceProvider } from '@my/common/models/dataSource.providers';

@Module({
  imports: [CommonModule, HttpModule],
  controllers: [BotController],
  providers: [TelegramService, ...usersProvider, ...telegramUsersProvider, ...dataSourceProvider],
})
export class BotModule {}
