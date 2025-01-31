import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';


@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot = null;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.bot = new TelegramBot(
      configService.get('telegram.apikey')
    );
  }

  /**
   * Send message to chat
   *
   * @param text
   */
  async reply(chatId: string, text: string) {
    const apikey = this.configService.get('telegram.apikey');
    const url = `https://api.telegram.org/bot${ apikey }/sendMessage`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, {
          chat_id: chatId,
          text,
        }).pipe(
          catchError((err: AxiosError) => {
            throw err;
          }),
        ),
      );
      return data;
    } catch(e) {
      this.logger.debug(e.response.data);
    }
  }
}
