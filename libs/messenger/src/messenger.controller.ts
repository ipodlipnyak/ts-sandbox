import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponseStatusEnum, RestResponseDto, TelegramEventMessageInputDto } from '@my/common/dto';
import { ProducerService } from './producer.service';
import { TelegramGuard } from './telegram.guard';
import { AuthGuard } from '@my/common/guards';
import { TelegramService } from './telegram.service';

@Controller('tg')
export class MessengerController {
  private readonly logger = new Logger(MessengerController.name)

  constructor(
    private producerService: ProducerService,
    private telegramService: TelegramService,
  ) {}

  // @ApiOperation({ summary: 'Get saved messages list' })
  // @ApiResponse({ status: 200, type: MessagesListResponseDto })
  // @UseGuards(AdminGuard)
  // @Get('')
  // async getMessages(): Promise<MessagesListResponseDto> {
  //   const result: MessagesListResponseDto = {
  //     status: ResponseStatusEnum.ERROR,
  //     payload: [],
  //     total: 0,
  //     offset: 0,
  //     limit: 0
  //   };

  //   const messagesList = await Message.find({
  //     order: {
  //       'created': 'DESC',
  //       'id': 'ASC',
  //     },
  //     take: 10,
  //   });

  //   result.payload = messagesList.map((msg) => ({
  //     id: `${ msg.id }`,
  //     text: msg.content,
  //     chat_id: msg.chatid,
  //   }));
  //   result.total = result.payload.length;
  //   result.limit = result.payload.length;
  //   result.status = ResponseStatusEnum.SUCCESS;

  //   return result;
  // }

  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @UseGuards(TelegramGuard)
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

  @ApiParam({
    name: 'token',
    example: 'fuck'
  })
  @Get('/bind/:token')
  // @UseGuards(AuthGuard)
  async bind(
    @Param('token') token: string
  ) {
    return await this.telegramService.executeBindToken(token);
    // return await this.telegramService.encrypt(token);
  }
}
