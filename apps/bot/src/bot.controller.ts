import { BotQueuePayloadDTO, TelegramMessageDto } from '@my/common';
import { BOT_COMMANDS } from '@my/messenger/constants';
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

  /**
   * Helper function to extract json object from posted to queue message
   *
   * @param data message taken from queue
   * @returns
   */
  parseQueuePayload(data: string) {
    return JSON.parse(data) as BotQueuePayloadDTO;
  }

  @MessagePattern(BOT_COMMANDS.TALK.NAME)
  reply(data: string) {
    if (!data) {
      this.logger.warn('No data provided');
    }

    const payload = this.parseQueuePayload(data);
    const message = payload.message;

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
  @MessagePattern(BOT_COMMANDS.GENERATE_BIND_TOKEN.NAME)
  async getLinkToBindEmail(data: string) {
    if (!data) {
      this.logger.warn('No data provided');
    }

    const payload = this.parseQueuePayload(data);
    const message = payload.message;

    try {
      const tgUser = await this.telegramService.getTelegramUserByTelegramMessage(message);
      if (tgUser) {
        this.telegramService.reply(message.chat.id, `Nope, no can do. Duck off. You are already a duck.`);
        return;
      }

      const token = this.telegramService.generateBindToken(message);
      const url = `${this.configService.get('web.url')}/my/settings?tg-token=${token}`;

      this.telegramService.reply(message.chat.id, `Go to your [page](${url}) to authorise this user`);
    } catch (e) {
      this.logger.debug(e);
    }
  }

  @MessagePattern(BOT_COMMANDS.START.NAME)
  async start(data: string) {
    if (!data) {
      this.logger.warn('No data provided');
    }

    const payload = this.parseQueuePayload(data);
    const message = payload.message;

    try {
      const tgUser = await this.telegramService.getTelegramUserByTelegramMessage(message);
      if (!tgUser) {
        this.telegramService.reply(message.chat.id, `New here? Try to authorise by \`/${BOT_COMMANDS.GENERATE_BIND_TOKEN}\` command`);
        return;
      }

      const url = `${this.configService.get('web.url')}/my/`;
      this.telegramService.reply(message.chat.id, `Oh I know you. You are good and ready. Just do whatever you want. Or check your profile in [here](${url})`);
    } catch (e) {
      this.logger.debug(e);
    }
  }

  @MessagePattern(BOT_COMMANDS.SETTINGS.NAME)
  async settings(data: string) {
    if (!data) {
      this.logger.warn('No data provided');
    }

    const payload = this.parseQueuePayload(data);
    const message = payload.message;

    try {
      const tgUser = await this.telegramService.getTelegramUserByTelegramMessage(message);
      if (tgUser) {
        this.telegramService.reply(message.chat.id, `New here? Try to authorise by \`/${BOT_COMMANDS.GENERATE_BIND_TOKEN}\` command`);
        return;
      }

      this.telegramService.reply(message.chat.id, `
        ## Settings:
        -**email**: \`${tgUser.user.email}\`
        `);
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
