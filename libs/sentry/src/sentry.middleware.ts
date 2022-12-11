/**
 * @see https://stackoverflow.com/a/63934472
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

// import { SentryService } from './sentry.service';

import { User as SentryUser } from '@sentry/types';

import * as Sentry from '@sentry/node';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {

      // const sentryService = SentryService.SentryServiceInstance();
      // const sentry = sentryService.SentryInstance;
      const whoami = request?.session?.whoami;
      let user: SentryUser = undefined;

      if (whoami?.id) {
        user = {
          id: `${whoami.id}`,
          email: whoami?.email,
        };
      }

      if (user) {
        Sentry.setUser(user);
      }

      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const message = `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`;
      Sentry.withScope((scope) => {
        /*
        const session = scope.getSession();
        if (user) {
          scope.setUser(user);
        }
        */
        this.logger.verbose(message);
      });
    });

    next();
  }
}