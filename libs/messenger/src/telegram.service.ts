import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TelegramMessageDto, TelegramUsers, Users } from '@my/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt, scryptSync } from 'crypto';
import { promisify } from 'util';
import { CryptoService } from '@my/common/services';
import { BindTelegramToEmailDTO } from './messenger.dto';


const TELEGRAM_API_URL = 'https://api.telegram.org';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot = null;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private cryptoService: CryptoService,
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
   * Search for existing telegram user by body content from telegram event message
   *
   * @see https://core.telegram.org/bots/api#messageentity
   * @param message
   * @param user
   * @returns
   */
  async getTelegramUserByTelegramMessage(message: TelegramMessageDto) {
    const tgUser = await TelegramUsers.findOneBy({
      tgUserId: message.from.id,
      tgChatId: message.chat.id,
    });

    return tgUser;
  }

  async generateBindToken(message: TelegramMessageDto, user: Users) {
    const payload: BindTelegramToEmailDTO = {
      tgChatId: message.chat.id,
      tgUserId: message.from.id,
      username: message.from.username,
      firstName: message.from.first_name,
      lastName: message.from.last_name,
      email: user.email,
    };

    return this.cryptoService.encrypt(JSON.stringify(payload));
  }

  /**
   * Extract payload from token and execute it;
   * @param token
   */
  async executeBindToken(token: string) {
    const payload = JSON.parse(await this.cryptoService.decrypt(token)) as BindTelegramToEmailDTO;
    this.bindTelegramUserIdToEmail(payload);
  }

  /**
   * Authorise this telegram user to have an access on the level of profile with specific email
   *
   * @param message
   * @param user
   * @returns
   */
  async bindTelegramUserIdToEmail(data: BindTelegramToEmailDTO) {
    const user = await Users.findOneBy({
      email: data.email
    });

    if (!user) {
      this.logger.debug(`User with email ${data.email} not authorised`);
      return null;
    }

    try {
      const newTgUser = TelegramUsers.create({
        tgChatId: data.tgChatId,
        tgUserId: data.tgUserId,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        user,
      });
      await newTgUser.save();
      await newTgUser.reload();
      return newTgUser;
    } catch (err) {
      this.logger.debug(`
        Can not attach telegram user ${data.username || data.tgUserId}
        to email ${user.email}. This relation probably already exist.
      `);
      this.logger.debug(err);
      return null;
    }
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
