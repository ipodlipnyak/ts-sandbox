import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { BotQueuePayloadDTO, TelegramMessageDto, TelegramUsers, Users } from '@my/common';
import { CacheService, CryptoService } from '@my/common/services';
import { BindTelegramToEmailDTO, TelegramApiDTO, TelegramUsersOutputDto } from './dto';
import { Repository } from 'typeorm';
import { DI_TOKENS } from '@my/common/constants';
import { BOT_COMMANDS } from './constants';

const TELEGRAM_API_URL = 'https://api.telegram.org';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot = null;

  private cacheKey = 'telegram';

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private cryptoService: CryptoService,
    private cacheService: CacheService,

    @Inject(DI_TOKENS.DATA_SOURCE.DEFAULT.REPOSITORIES.USERS)
    private usersRepository: Repository<Users>,
    @Inject(DI_TOKENS.DATA_SOURCE.DEFAULT.REPOSITORIES.TELEGRAM_USERS)
    private telegramUsersRepository: Repository<TelegramUsers>,
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
   * Set cached value
   *
   * @param key
   * @param value
   */
  async setCache(key: string, value: any) {
    const cacheKeyFull = `${this.cacheKey}.${key}`;
    try {
      await this.cacheService.set(cacheKeyFull, value);
    } catch(err) {
      this.logger.error(err);
    }
  }

  /**
   * Get cached value
   *
   * @param key
   * @returns
   */
  async getCache(key: string) {
    const cacheKeyFull = `${this.cacheKey}.${key}`;
    try {
      const value = await this.cacheService.get(cacheKeyFull);
      return value;
    } catch(err) {
      this.logger.error(err);
    }
  }

  /**
   * Clean cached values.
   * If key not provided will attempt to delete all related keys.
   *
   * @param key
   * @see https://redis.io/docs/latest/commands/del/
   */
  async cleanCache(key?: string) {
    if (!key) {
      return await this.cacheService.del();
    }

    const cacheKeyFull = `${this.cacheKey}.${key}`;
    return await this.cacheService.del(cacheKeyFull);
  }

  /**
   * Simple way to communicate with telegram api over post methods
   *
   * @param method telegram method
   * @param params method's parameters
   * @param force ignore cached data and force request
   * @see https://core.telegram.org/bots/api#available-methods
   * @returns
   */
  /** @see https://core.telegram.org/bots/api#getwebhookinfo */
  private async post(method: 'getWebhookInfo', params?: any, cached?: boolean): Promise<TelegramApiDTO.Response<TelegramApiDTO.WebhookInfo>>
  /** @see https://core.telegram.org/bots/api#setwebhook */
  private async post(method: 'setWebhook', params: { url: string, secret_token: string }, cached?: boolean): Promise<TelegramApiDTO.Response>
  /** @see https://core.telegram.org/bots/api#setmycommands */
  private async post(method: 'setMyCommands', params: { commands: TelegramApiDTO.BotCommand[] }): Promise<TelegramApiDTO.Response<TelegramApiDTO.BotCommand>>
  /** @see https://core.telegram.org/bots/api#getmycommands */
  private async post(method: 'getMyCommands', params?: any, cached?: boolean): Promise<TelegramApiDTO.Response<TelegramApiDTO.BotCommand[]>>
  /** @see https://core.telegram.org/bots/api#sendmessage */
  private async post(method: 'sendMessage', params: { chat_id: string, text: string, parse_mode: 'MarkdownV2' | 'HTML' }): Promise<TelegramApiDTO.Response<TelegramApiDTO.Message>>
  private async post(method: 'sendChatAction', params: { chat_id: string, action: TelegramApiDTO.ChatAction }): Promise<TelegramApiDTO.Response<TelegramApiDTO.Message>>
  private async post(method: string, params?: any, cached: boolean = false): Promise<TelegramApiDTO.Response<any>> {
    if (cached) {
      const cachedValue = await this.getCache(method);
      if (cachedValue) {
        return cachedValue as TelegramApiDTO.Response;
      }
    }

    try {
      const { data }: { data: TelegramApiDTO.Response } = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/${method}`, params).pipe(
          catchError((err: AxiosError) => {
            throw err;
          }),
        ),
      );
      /** @see https://core.telegram.org/bots/api#making-requests */
      if (cached) {
        this.setCache(method, data);
      }
      return data;
    } catch (e) {
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
    return await this.post('getWebhookInfo', {}, true);
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

  async generateBindToken(message: TelegramMessageDto) {
    const payload: BindTelegramToEmailDTO = {
      tgChatId: message.chat.id,
      tgUserId: message.from.id,
      username: message.from.username,
      firstName: message.from.first_name,
      lastName: message.from.last_name,
    };

    return this.cryptoService.encrypt(JSON.stringify(payload));
  }

  /**
   * Find telegram users by user email
   *
   * @param email
   * @returns
   */
  async getTelegramUsersListByEmail(email: string) {
    const list = await this.telegramUsersRepository.find({
      where: {
        user: {
          email
        }
      }
    });
    const result: TelegramUsersOutputDto[] = list.map((telegramUser) => {
      const userFormatted: TelegramUsersOutputDto = {
        id: telegramUser.id,
        tgUserId: telegramUser.tgUserId,
        tgChatId: telegramUser.tgChatId,
        firstName: telegramUser.firstName,
        lastName: telegramUser.lastName,
        username: telegramUser.username,
      };
      return userFormatted;
    });
    return result;
  }

  /**
   * Extract payload from token and execute it;
   * @param token
   */
  async executeBindToken(token: string, email: string) {
    const payload = await this.cryptoService.decrypt(token);
    const data = JSON.parse(payload) as BindTelegramToEmailDTO;
    this.bindTelegramUserIdToEmail(data, email);
  }

  /**
   * Delete telegram chat from authorised by user
   *
   * @param id telegram to user relation id (TelegramUsers)
   * @returns
   */
  async unbindTelegramUser(id: string) {
    return await this.telegramUsersRepository.delete(id);
  }

  /**
   * Authorise this telegram user to have an access on the level of profile with specific email
   *
   * @param message
   * @param user
   * @returns
   */
  async bindTelegramUserIdToEmail(data: BindTelegramToEmailDTO, email: string) {
    if (!data?.tgChatId) {
      this.logger.error('Wrong data passed: no chat id');
      return null;
    }

    const user = await this.usersRepository.findOneBy({
      email: email
    });

    if (!user) {
      this.logger.debug(`User with email ${email} not authorised`);
      return null;
    }

    try {
      const newTgUser = this.telegramUsersRepository.create({
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
      /** @see https://core.telegram.org/bots/api#formatting-options */
      parse_mode: 'HTML',
    });
  }

  /**
   * Use this method when you need to tell the user that something is happening on the bot's side
   *
   * @see https://core.telegram.org/bots/api#sendchataction
   * @param chatId
   * @param action
   * @returns
   */
  async sendChatAction(chatId: string, action: TelegramApiDTO.ChatAction = 'typing') {
    return await this.post('sendChatAction', {
      chat_id: chatId,
      action,
    })
  }

  /**
   * Prepare telegram message to be posted in brocker queue
   *
   * @param message
   */
  processIncomingMessage(message: TelegramMessageDto) {
    let action = {
      command: BOT_COMMANDS.TALK.NAME,
      arguments: [message.text],
    }

    if (message.text.startsWith('/')) {
      action = this.extractCommandFromIncomingMessage(message);
    }

    const payload: BotQueuePayloadDTO = {
      message,
      arguments: action.arguments,
    };

    const queue = action.command;
    return {
      payload,
      queue
    }

    // this.producerService.addToQueue(payload, queue);
  }


  /**
   * Extract command name and related to it arguments from message text
   *
   * @param message
   * @returns
   */
  extractCommandFromIncomingMessage(message: TelegramMessageDto) {
    // split text into commands with slash symbol and words
    const commandWithArgumentsRegexp = /[\/,\s][\w,\-]+/g;

    const commandArguments = message.text.match(commandWithArgumentsRegexp);

    // get command name (it is always the first element) and clean it from first slash symbol '/'
    const command = commandArguments.shift().slice(1);
    return {
      command,
      arguments: commandArguments,
    }
  }

  /**
   * @see https://core.telegram.org/bots/api#getmycommands
   * @returns
   */
  async getMyCommandsList() {
    const response = await this.post('getMyCommands', {}, true);

    if (response.ok === true) {
      const commandsList = response.result;
      return commandsList;
    }
  }

  /**
   * @see https://core.telegram.org/bots/api#setmycommands
   */
  async updateBotCommandsList() {
    const commands: TelegramApiDTO.BotCommand[] = [
      {
        command: BOT_COMMANDS.START.NAME,
        description: BOT_COMMANDS.START.DESCRIPTION,
      },
      {
        command: BOT_COMMANDS.HELP.NAME,
        description: BOT_COMMANDS.HELP.DESCRIPTION,
      },
      {
        command: BOT_COMMANDS.SETTINGS.NAME,
        description: BOT_COMMANDS.SETTINGS.DESCRIPTION,
      },
      {
        command: BOT_COMMANDS.GENERATE_BIND_TOKEN.NAME,
        description: BOT_COMMANDS.GENERATE_BIND_TOKEN.DESCRIPTION,
      },
      {
        command: BOT_COMMANDS.TALK.NAME,
        description: BOT_COMMANDS.TALK.DESCRIPTION,
      }
    ];
    return await this.post('setMyCommands', {
      commands
    });
  }
}
