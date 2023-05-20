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
  GoogleCalendarEventDto,
} from '../dto';
import { AuthGuard, AdminGuard } from './../guards';
import { GoogleService } from '@my/google';
import { UsersService } from '@my/users';
import { EventsService, UserService } from '../services';

@Controller('calendar')
export class CalendarController {
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
    private userService: UserService,
    private eventService: EventsService,
  ) { }

  @UseGuards(AdminGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Get list of calendars' })
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
  async calendarList(): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
      total: 0,
      offset: 0,
      limit: 0
    };

    // const list = await this.eventService.getAll();
    const list = await this.googleService.getCalendarList();

    result.payload = list;
    // result.total = list.length;
    // result.limit = list.length;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Get list of events' })
  @ApiResponse({ status: 200, type: RestListResponseDto })
  @ApiInternalServerErrorResponse({
    schema: {
      oneOf: [
        {
          description: 'Not found',
        },
      ],
    },
  })
  @Get('event')
  async eventsList(): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: [],
      total: 0,
      offset: 0,
      limit: 0
    };

    const response = await this.googleService.calendarV3.events.list({
      calendarId: this.configService.get('google.mainCalendarId'),
    });

    result.payload = response.data.items;
    result.total = result.payload.length; 
    result.limit = result.payload.length;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  /**
   * @see https://developers.google.com/calendar/api/v3/reference/events/insert#node.js
   */
  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Insert new event' })
  @ApiResponse({ status: 200, type: RestListResponseDto })
  @ApiInternalServerErrorResponse({
    schema: {
      oneOf: [
        {
          description: 'Not found',
        },
      ],
    },
  })
  @Post('event')
  async insertEvent(
    @Body() event: GoogleCalendarEventDto,
  ): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: [],
      total: 0,
      offset: 0,
      limit: 0
    };

    const response = await this.googleService.calendarV3.events.insert({
      calendarId: this.configService.get('google.mainCalendarId'),
      requestBody: {
        start: event.start || undefined,
        end: event.end || undefined,
        summary: event.summary || '',
        description: event.description || '',
        location: event.location || '',
        attendees: event.attendees || [],
      }
    })

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
