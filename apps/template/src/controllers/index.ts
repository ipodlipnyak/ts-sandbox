export * from './app.controller';
export * from './auth.controller';
export * from './admin.controller';
export * from './products.controller';
export * from './purchases.controller';
export * from './track.controller';
export * from './rating.controller';
export * from './users.controller';
export * from './google.controller';
export * from './llm.controller';
export * from './calendar.controller';

import { AppController } from './app.controller';
import { AdminController } from './admin.controller';
import { AuthController } from './auth.controller';
import { ProductsController } from './products.controller';
import { PurchasesController } from './purchases.controller';
import { TrackController } from './track.controller';
import { RatingController } from './rating.controller';
import { UsersController } from './users.controller';
import { GoogleController } from './google.controller';
import { LLMController } from './llm.controller';
import { CalendarController } from './calendar.controller';

export const controllers = [
  AppController,
  AdminController,
  AuthController,
  ProductsController,
  PurchasesController,
  TrackController,
  RatingController,
  UsersController,
  GoogleController,
  LLMController,
  CalendarController,
];
