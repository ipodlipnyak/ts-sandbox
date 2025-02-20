import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ResponseStatusEnum, RestResponseDto, TelegramEventMessageInputDto, TelegramUserDto } from '@my/common/dto';
import { ProducerService } from './producer.service';
import { TelegramGuard } from './telegram.guard';
import { AuthGuard } from '@my/common/guards';
import { TelegramService } from './telegram.service';
import { UserService } from '@my/common/services';
import { TelegramUsersListResponseDto } from './messenger.dto';

@Controller('tg')
export class MessengerController {
  private readonly logger = new Logger(MessengerController.name)

  constructor(
    private producerService: ProducerService,
    private telegramService: TelegramService,
    private userSerivce: UserService,
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
      this.producerService.addToQueue(input.message);
    } catch (e) {
      this.logger.debug(e);
    }


    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Authorise specific telegram chat to work in users context' })
  @ApiParam({
    description: 'Token allowing to authorise telegram profile as a user',
    name: 'token',
    example: 'blahBlahBlah'
  })
  @Get('/bind/:token')
  async bind(
    @Param('token') token: string
  ) {
    const result = {
      status: ResponseStatusEnum.ERROR,
    };

    try {
      const email = this.userSerivce.email;
      await this.telegramService.executeBindToken(token, email);
      result.status = ResponseStatusEnum.SUCCESS;
    } catch (err) {
      //
    }

    return result
  }
}
