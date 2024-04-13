import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql'
import { GoogleCalendarEventDto, GoogleCalendarDto, GoogleCalendarEventResourceDto } from "../../dto";
import {
    UseGuards,
} from '@nestjs/common';
import { GqlAdminGuard, GqlAuthGuard } from '../../guards';
import { UserService } from '../../services';
import { GoogleService } from '@my/google';
import { Field, ObjectType } from '@nestjs/graphql';
import { calendar_v3 } from 'googleapis';

function mapGoogleEventToDto(
  event: calendar_v3.Schema$Event,
  calendarId: string,
): GoogleCalendarEventResourceDto {
  const result: GoogleCalendarEventResourceDto = {
    calendarId,
    summary: event?.summary,
    location: event?.location,
    description: event?.description,
    htmlLink: event.htmlLink,
    created: event.created,
    updated: event.updated,
    start: {
      dateTime: event?.start?.dateTime,
      timeZone: event?.start?.timeZone
    },
    end: {
      dateTime: event?.end?.dateTime,
      timeZone: event?.end?.timeZone
    },
    attendees: []
  }
  return result;
}

@UseGuards(GqlAuthGuard)
@Resolver(of => GoogleCalendarEventResourceDto)
export class EventResolver {
    constructor(
      private readonly userService: UserService,
      private readonly googleService: GoogleService,
    ) { }

    @ResolveField('calendar', returns => GoogleCalendarDto)
    async calendar(@Parent() event: GoogleCalendarEventResourceDto) {
      const result = this.googleService.getCalendar(event.calendarId);
      return result;
    }

    @Query(returns => [GoogleCalendarEventResourceDto])
    async eventsOngoing(): Promise<GoogleCalendarDto[]> {
        const email = this.userService.email;
        const all = await this.googleService.getUserEventOngoing(email);
        const result = all.map((el) => mapGoogleEventToDto(el.event, el.calendarId));
        return result;
    }
}
