import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  Delete,
  Session,
  UseGuards,
  Body,
  Param,
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
  GoogleCalendarAclDto,
GoogleCalendarDto,
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
  @ApiOperation({ summary: 'Get primary calendar' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @Get('primary')
  async getPrimaryCalendar(): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const response = await this.googleService.calendarV3.calendars.get({
      calendarId: 'primary',
    });

    result.payload = response.data;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @UseGuards(AdminGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create new calendar' })
  @ApiResponse({ status: 200, type: RestListResponseDto })
  @Post('')
  async insertCalendar(
    @Body() input: GoogleCalendarDto
  ): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const response = await this.googleService.calendarV3.calendars.insert({
      requestBody: {
        summary: input.summary,
        timeZone: input?.timeZone || undefined,
      }
    });

    result.payload = response.statusText;

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

  @UseGuards(AdminGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Details about specific calendar' })
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
  @Get(':id')
  async getCalendar(@Param('id') id: string): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined, 
    };
    const response = await this.googleService.calendarV3.calendarList.get({
      calendarId: id,
    });

    result.payload = response.data;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @UseGuards(AdminGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Get Access Controll List (ACL) for a specific calendar' })
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
  @Get(':id/acl')
  async getAcl(@Param('id') id: string): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined, 
    };
    const response = await this.googleService.calendarV3.acl.list({
      calendarId: id,
    });

    result.payload = response.data;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  /**
   * @see https://developers.google.com/calendar/api/v3/reference/acl/insert#request-body
   * @param id calendar id 
   */
  @UseGuards(AdminGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Add new rule in Access Controll List (ACL) for a specific calendar' })
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
  @Post(':id/acl')
  async addAclRule(
    @Param('id') id: string,
    @Body() acl: GoogleCalendarAclDto,
  ): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined, 
    };
    const response = await this.googleService.calendarV3.acl.insert({
      calendarId: id,
      requestBody: {
        role: acl?.role || 'reader', // writer, owner, freeBusyReader, none
        scope: {
          type: acl?.scope?.type || 'user',
          value: acl?.scope?.value || 'default',
        }
      }
    });

    result.payload = response.data;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @UseGuards(AdminGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Remove rule from Access Controll List (ACL) for a specific calendar' })
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
  @Delete(':id/acl/:ruleId')
  async removeAclRule(
    @Param('id') id: string,
    @Param('ruleId') ruleId: string,
  ): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined, 
    };
    const response = await this.googleService.calendarV3.acl.delete({
      calendarId: id,
      ruleId: ruleId,
    });

    result.payload = response.data;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
