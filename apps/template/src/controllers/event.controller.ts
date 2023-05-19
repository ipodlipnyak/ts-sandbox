import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
  Body,
  // Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestResponseDto,
  GoogleInitReponseDto,
  JWTInputDto,
  RestListResponseDto,
} from '../dto';
import { AuthGuard } from './../guards';
import { GoogleService } from '@my/google';
import { UsersService } from '@my/users';
import { EventsService, UserService } from '../services';

@Controller('events')
export class EventController {
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
    private userService: UserService,
    private eventService: EventsService,
  ) { }

  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Get list of events' })
  @ApiResponse({ status: 200, type: RestListResponseDto })
  @ApiInternalServerErrorResponse({
    schema: {
      oneOf: [
        {
          description: 'Missing client Id',
        },
      ],
    },
  })
  @Get('')
  async clientInit(): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
      total: 0,
      offset: 0,
      limit: 0
    };

    // const list = await this.eventService.getAll();
    const list = await this.googleService.getCalendar();

    result.payload = list;
    // result.total = list.length;
    // result.limit = list.length;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
