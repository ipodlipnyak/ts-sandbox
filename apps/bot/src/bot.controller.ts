import { TelegramMessageDto } from '@my/common';
import { TelegramService } from '@my/messenger/telegram.service';
import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class BotController {
  private readonly logger = new Logger(BotController.name);

  constructor(
    private telegramService: TelegramService,
    private configService: ConfigService,
  ) { }

  @MessagePattern('reply')
  reply(data: string) {
    if (!data) {
      this.logger.warn('No data provided');
    }

    const message = JSON.parse(data) as TelegramMessageDto;

    try {
      this.telegramService.reply(message.chat.id, `Simon says ${message.text}`);
    } catch (e) {
      this.logger.debug(e);
    }
  }

  /**
   * Generate a link that will bind telegram id to user's email profile authorised to use site
   *
   * @param data
   */
  @MessagePattern('get-link-to-bind-email')
  async getLinkToBindEmail(data: string) {
    if (!data) {
      this.logger.warn('No data provided');
    }

    const message = JSON.parse(data) as TelegramMessageDto;

    try {
      const tgUser = await this.telegramService.getTelegramUserByTelegramMessage(message);
      if (tgUser) {
        this.telegramService.reply(message.chat.id, `Nope, no can do. Duck off. You already a duck.`);
        return;
      }

      const token = this.telegramService.generateBindToken(message);
      const url = `${this.configService.get('web.url')}/my/settings?tg-token=${token}`;

      this.telegramService.reply(message.chat.id, `Go to your [page](${url}) to authorise this user`);
    } catch (e) {
      this.logger.debug(e);
    }
  }
  // @MessagePattern('authorise')
  // authorise(data: string) {
  //   if (!data) {
  //     this.logger.warn('No data provided');
  //   }

  //   const message = JSON.parse(data) as TelegramMessageDto;

  //   try {
  //     this.telegramService.reply(message.chat.id, `Simon says ${message.text}`);
  //   } catch (e) {
  //     this.logger.debug(e);
  //   }
  // }

  // @MessagePattern('list_waiting_room')
  // listWaitingRoom(data: string) {
  //   if (!data) {
  //     this.logger.warn('No data provided');
  //   }

  //   const message = JSON.parse(data) as TelegramMessageDto;

  //   try {
  //     this.telegramService.reply(message.chat.id, `Simon says ${message.text}`);
  //   } catch (e) {
  //     this.logger.debug(e);
  //   }
  // }

  // @MessagePattern('let_me_in')
  // letMeIn(data: string) {
  //   if (!data) {
  //     this.logger.warn('No data provided');
  //   }

  //   const message = JSON.parse(data) as TelegramMessageDto;

  //   try {
  //     this.telegramService.reply(message.chat.id, `Simon says ${message.text}`);
  //   } catch (e) {
  //     this.logger.debug(e);
  //   }
  // }
}
