export * from './example.service';
export * from './user.service';
export * from './rating.service';
export * from './fixtures.service';
export * from './event.service';

import { ExampleService } from './example.service';
import { UserService } from './user.service';
import { RatingService } from './rating.service';
import { FixturesService } from './fixtures.service';
import { EventsService } from './event.service';

export const services = [ExampleService, UserService, RatingService, FixturesService, EventsService];
