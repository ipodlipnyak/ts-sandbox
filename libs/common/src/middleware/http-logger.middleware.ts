/**
 * @see https://stackoverflow.com/a/63934472
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const message = `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`;
      this.logger.verbose(message);
    });

    next();
  }
}
