import { Resolver, Query, Mutation, Args, ResolveField, Parent, Info } from '@nestjs/graphql'
import { UserOutputDto, RestResponseDto, ResponseStatusEnum, GoogleCalendarEventDto } from "../../dto";
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { GqlAdminGuard, GqlAuthGuard } from '../../guards';
import { Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DeepPartial } from 'typeorm';
import { query } from 'express';
import { UserService } from '../../services';
import { GoogleService } from '@my/google';
import { Field, InputType, ObjectType, ID, Float, Extensions } from '@nestjs/graphql';

const pubSub = new PubSub();

// @Resolver(type => Users) // Reminder: Character is an interface
// export class UsersInterfaceResolver {
//     @ResolveField(() => [Users])
//     friends(
//       @Parent() user: any, // Resolved object that implements Character
//       @Info() { parentType }, // Type of the object that implements Character
//       @Args('search', { type: () => String }) searchTerm: string,
//     ) {
//       // Get character's friends
//       return [];
//     }
// }

@UseGuards(GqlAuthGuard)
@Resolver('event')
export class EventResolver {
    constructor(
      private readonly userService: UserService,
      private readonly googleService: GoogleService,
    ) { }

    @Query(returns => GoogleCalendarEventDto || null)
    async eventOngoing(@Args('fuck', { nullable: true }) fuck?: string): Promise<GoogleCalendarEventDto | null> {
        const email = await this.userService.email;
        const { calendarId, event } = await this.googleService.getUserEventOngoing(email);
        if (!event) {
          throw new NotFoundException('No close or ongoing events had been found');
        }

        const result: GoogleCalendarEventDto = {
          calendarId,
          summary: event?.summary,
          location: event?.location,
          description: event?.description,
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
}
