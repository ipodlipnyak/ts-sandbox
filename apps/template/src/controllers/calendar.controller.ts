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
  Logger,
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
CalendarAclListResponseDto,
} from '../dto';
import { AuthGuard, AdminGuard } from './../guards';
import { GoogleService } from '@my/google';
import { UsersService } from '@my/users';
import { /* EventsService,*/ UserService } from '../services';
import { Users } from '../models';
import { In } from 'typeorm';

@Controller('calendar')
export class CalendarController {
  private readonly logger = new Logger(CalendarController.name);

  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
    private userService: UserService,
    // private eventService: EventsService,
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
    // const list = await this.googleService.getCalendarList();
    const email = await this.userService.getEmail();
    const list = await this.googleService.getUserCalendarsList(email);

    result.payload = list;

    result.total = list.length;
    result.limit = list.length;
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
  @ApiOperation({ 
    summary: 'Create new calendar',
    externalDocs: {
      description: 'Payload field in response contain google calendar resource',
      url: 'https://developers.google.com/calendar/api/v3/reference/calendars#resource',
    }
  })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @Post('')
  async insertCalendar(
    @Body() input: GoogleCalendarDto
  ): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    // const response = await this.googleService.calendarV3.calendars.insert({
    //   requestBody: {
    //     summary: input.summary,
    //     timeZone: input?.timeZone || undefined,
    //   }
    // });
    const email = await this.userService.getEmail();   
    const newCalendar = await this.googleService.createCalendarForUser(email, input.summary, input.timeZone);

    result.payload = newCalendar;

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

    /*
    const response = await this.googleService.calendarV3.events.list({
      calendarId: this.configService.get(GoogleService.MAIN_CALENDAR_ID),
    });
    */

    const email = await this.userService.getEmail();
    result.payload = await this.googleService.getUserEventsList(email); 
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
  @ApiBadRequestResponse({
    schema: {
      oneOf: [
        {
          description: 'Event summary required',
        },
      ],
    },
  })
  @Post('event')
  async insertEvent(
    @Body() event: GoogleCalendarEventDto,
  ): Promise<RestResponseDto> {
    if (!event.summary) {
      throw new HttpException('Event summary required', HttpStatus.BAD_REQUEST);
    }

    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
    };

    const email = await this.userService.getEmail();
    const calendarId = event.calendarId || this.configService.get(GoogleService.MAIN_CALENDAR_ID);

    try {
      const response = await this.googleService.createNewUserEvent(email, calendarId, event);
      result.payload = response;
      result.status = ResponseStatusEnum.SUCCESS;
    } catch(error) {
      this.logger.error(error);
    }

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

  @Delete(':id')
  async deleteCalendar(@Param('id') id: string): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
    }

    try {
      await this.googleService.deleteCalendar(id);
      result.status = ResponseStatusEnum.SUCCESS;
    } catch (error) {
      //
    }

    return result;
  }

  @Get(':id/acl')
  async getAcl(@Param('id') id: string): Promise<CalendarAclListResponseDto> {
    const result: CalendarAclListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: [],
      total: 0,
      offset: 0,
      limit: 0, 
    };
    const response = await this.googleService.calendarV3.acl.list({
      calendarId: id,
    });

    const rulesList = response.data.items;
    // const myEmail = await this.userService.getEmail();

    // lets remove service accounts from this list
    const serviceGoogleDomains = [
      'group.calendar.google.com',
      'iam.gserviceaccount.com',
      // myEmail
    ];

    const rulesListFiltered = rulesList.filter((rule) => {
      return ! serviceGoogleDomains.some((serviceDomain) => {
        return rule.scope.value.endsWith(serviceDomain);
      });
    });

    const usersList = await Users.find({
      where: {
        email: In(rulesListFiltered.map((rule) => rule.scope.value)),
      }
    });

    result.payload = rulesListFiltered.map((rule) => {
      const user = usersList.find((user) => user.email === rule.scope.value); 
      return {
        email: rule.scope.value,
        firstName: user?.firstName || '',
        middleName: user?.middleName || '',
        lastName: user?.lastName || '',
        pictureUrl: user?.pictureUrl || '',
      };
    });

    result.total = result.payload.length;
    result.limit = result.payload.length;
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
    const email = await this.userService.getEmail();
    const response = this.googleService.addCalendarAclRule(email, id, acl);

    result.payload = response;

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
