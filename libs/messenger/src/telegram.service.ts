import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

const TELEGRAM_API_URL = 'https://api.telegram.org';

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

  get apiUrl(): string {
    const apikey = this.configService.get('telegram.apikey');
    return `${TELEGRAM_API_URL}/bot${apikey}`;
  }

  /**
   * Simple way to communicate with telegram api over post methods
   *
   * @param method telegram method
   * @param params method's parameters
   * @see https://core.telegram.org/bots/api#available-methods
   * @returns
   */
  private async post(method:string, params?: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/${method}`, params).pipe(
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

  async setWebhook(endpoint?: string, secret?: string) {
    const domain = this.configService.get('web.domain');
    const protocol = this.configService.get('web.protocol');

    const webhookEndpoint = endpoint || `${protocol}://${domain}/api/tg/message`;
    const webhookSecretToken = secret || this.configService.get('telegram.secretkey');

    return await this.post('setWebhook', {
      url: webhookEndpoint,
      secret_token: webhookSecretToken,
    });
  }

  async getWebhookInfo() {
    return await this.post('getWebhookInfo');
  }

  /**
   * Send message to chat
   *
   * @param text
   */
  async reply(chatId: string, text: string) {
    return await this.post('sendMessage', {
          chat_id: chatId,
          text,
    });
  }
}
