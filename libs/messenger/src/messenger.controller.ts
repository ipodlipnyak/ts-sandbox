import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ResponseStatusEnum, RestResponseDto, TelegramEventMessageInputDto } from '@my/common/dto';
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
    private userSerivce: UserService,
    private producerService: ProducerService,
  ) {}

  @ApiOperation({ summary: 'Get telegram chats list authorised by a user' })
  @ApiResponse({ status: 200, type: TelegramUsersListResponseDto })
  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @Get('')
  async getMessages(): Promise<TelegramUsersListResponseDto> {
    const result: TelegramUsersListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: [],
      total: 0,
      offset: 0,
      limit: 0
    };

    const email = this.userSerivce.email;
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
  @Delete('/:id')
  async unbind(
    @Param('id') id: string
  ): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.SUCCESS,
    };

    // check for ownership before delete
    const email = this.userSerivce.email;
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
  @Post('/')
  async bind(
    @Body() input: TelegramBindInputDto,
  ) {
    const result = {
      status: ResponseStatusEnum.ERROR,
    };

    try {
      const email = this.userSerivce.email;
      await this.telegramService.executeBindToken(input.token, email);
      result.status = ResponseStatusEnum.SUCCESS;
    } catch (err) {
      this.logger.error(err);
    }

    return result
  }
}
