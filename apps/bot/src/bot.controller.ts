import { TelegramMessageDto } from '@my/common';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TelegramService } from './telegram.service';

@Controller()
export class BotController {
    private readonly logger = new Logger(BotController.name);

    constructor(
      private telegramService: TelegramService,
    ) {}

    @MessagePattern('reply')
    replyTg(data: string) {
      if (!data) {
        this.logger.warn('No data provided');
      }

      const message = JSON.parse(data) as TelegramMessageDto;

      try {
        this.telegramService.reply(message.chat.id, `Simon says ${ message.text }`);
      } catch (e) {
        this.logger.debug(e);
      }
    }
}
