import { Injectable, Scope, Inject } from '@nestjs/common';
import { Users, UserRole, UsersResolver, Event } from './../models';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RatingService } from './rating.service';
import { MyRatingItemDto } from './../dto';

@Injectable({ scope: Scope.REQUEST })
export class EventsService {
  async getAll(): Promise<Event[]> {
    const result = await Event.find();
    return result;
  }
}
