import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ResponseStatusEnum, RestResponseDto, TelegramConfigResponseDto, TelegramEventMessageInputDto, TelegramUserAuthoriseDto } from '@my/common/dto';
import { TelegramGuard } from './telegram.guard';
import { AuthGuard } from '@my/common/guards';
import { TelegramService } from './telegram.service';
import { UserService } from '@my/common/services';
import { TelegramBindInputDto, TelegramUsersListResponseDto } from './dto';
import { ProducerService } from './producer.service';

@Controller('tg')
export class MessengerController {
  private readonly logger = new Logger(MessengerController.name)

  constructor(
    private telegramService: TelegramService,
    private userService: UserService,
    private producerService: ProducerService,
  ) {}

  /**
   * Check request and authorise
   *
   * @see https://core.telegram.org/widgets/login#checking-authorization
   * @see https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2
   * @param input
   * @returns
   */
  @ApiOperation({ summary: 'Authorise user by telegram' })
  @Post('auth')
  async authorise(
    @Body() input: TelegramUserAuthoriseDto,
  ): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const hash = this.telegramService.generateAuthenticationHash({
      auth_date: input.auth_date,
      first_name: input.first_name,
      id: input.id,
      username: input.username,
    });
    if (hash !== input.hash) {
      this.logger.debug(`Cant login this man: ${input}`);
      this.logger.debug(`${hash} !== ${input.hash}`);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const email = await this.telegramService.getEmailByTelegramId(input.id);

    const isLoggedIn = await this.userService.loginByEmail(email);
    const user = await this.userService.getUser();

    if (!user) {
      throw new HttpException('This email is not authorised to login', HttpStatus.BAD_REQUEST);
    }

    let isdirty = false;
    if (!user.firstName) {
      user.firstName = input.first_name;
      isdirty = true;
    }
    if (!user.lastName) {
      user.lastName = input.last_name;
      isdirty = true;
    }
    if (!user.pictureUrl) {
      user.pictureUrl = input.photo_url;
      isdirty = true;
    }
    if (isdirty) {
      user.save();
    }

    if (!isLoggedIn) {
      throw new HttpException('This email is not authorised to login', HttpStatus.BAD_REQUEST);
    }

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @ApiOperation({ summary: 'Get telegram configs' })
  @ApiResponse({ status: 200, type: TelegramConfigResponseDto })
  @Get('')
  async getConfig() {
    const result: TelegramConfigResponseDto = {
      status: ResponseStatusEnum.SUCCESS,
      payload: {
        botName: this.telegramService.botName
      }
    }

    return result;
  }

  @ApiOperation({ summary: 'Get telegram chats list authorised by a user' })
  @ApiResponse({ status: 200, type: TelegramUsersListResponseDto })
  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @Get('/chat')
  async getMessages(): Promise<TelegramUsersListResponseDto> {
    const result: TelegramUsersListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: [],
      total: 0,
      offset: 0,
      limit: 0
    };

    const email = this.userService.email;
    const payload = await this.telegramService.getTelegramUsersListByEmail(email);

    result.payload = payload;
    result.total = result.payload.length;
    result.limit = result.payload.length;
    result.status = ResponseStatusEnum.SUCCESS;

    return result;
  }

  @ApiOperation({ summary: 'Remove this telegram chat from user authorised' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @Delete('/chat/:id')
  async unbind(
    @Param('id') id: string
  ): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.SUCCESS,
    };

    // check for ownership before delete
    const email = this.userService.email;
    const list = await this.telegramService.getTelegramUsersListByEmail(email);
    const match = list.find(item => item.id === id);

    if (match) {
      // he owns this chat so now we will delete this ownership
      this.telegramService.unbindTelegramUser(id);
    }

    return result;
  }

  @UseGuards(TelegramGuard)
  @ApiSecurity('telegram')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @Post('/message')
  newMessage(
    @Body() input: TelegramEventMessageInputDto,
  ): RestResponseDto {
    const result = {
      status: ResponseStatusEnum.ERROR,
    };

    this.logger.log(input);
    const text = input?.message?.text;

    if (!text) {
      throw new HttpException('No text in this message', HttpStatus.BAD_REQUEST);
    }

    try {
      const {payload, queue} = this.telegramService.processIncomingMessage(input.message);
      this.producerService.addToQueue(payload, queue);
    } catch (e) {
      this.logger.debug(e);
    }

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Authorise specific telegram chat to work in users context' })
  @Post('/chat')
  async bind(
    @Body() input: TelegramBindInputDto,
  ) {
    const result = {
      status: ResponseStatusEnum.ERROR,
    };

    try {
      const email = this.userService.email;
      await this.telegramService.executeBindToken(input.token, email);
      result.status = ResponseStatusEnum.SUCCESS;
    } catch (err) {
      this.logger.error(err);
    }

    return result
  }
}
