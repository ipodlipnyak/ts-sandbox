import * as session from 'express-session';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as createRedisStore from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { SessionDto } from './dto';
import * as Sentry from "@sentry/node";


/**
 * @see https://stackoverflow.com/a/65381085
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-session/index.d.ts#L23
 */
declare module 'express-session' {
  // eslint-disable-next-line
  export interface SessionData extends SessionDto { }
}

const isDev = process.env.NODE_ENV !== 'production';
const DEBUG = !!process.env?.DEBUG;

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /** @see https://docs.sentry.io/platforms/node/guides/express/ */
  const dsn = configService.get('sentry.dsn');
  if (dsn) {
    Sentry.init({ dsn });
    // app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.errorHandler());
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  /** Swagger */
  if (DEBUG) {
    const docConfig = new DocumentBuilder()
      .setTitle('Cyphroclerk app')
      .setDescription('Simple api')
      .setVersion('1.0')
      .addTag('cyphroclerk')
      .addCookieAuth('connect.sid', undefined, 'user')
      .addCookieAuth('connect.sid', undefined, 'admin')
      .addServer('/api')
      .build();
    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('api', app, document);
  }

  app.setGlobalPrefix('api');

  /** Sessions */
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    legacyMode: true,
    url: configService.get('sessions.redisUrl'),
  });
  redisClient.connect().catch(console.error);

  redisClient.on('error', (err) =>
    logger.error('Could not establish a connection with redis. ' + err),
  );
  redisClient.on('connect', () => logger.verbose('Connected to redis successfully'));

  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      secret: configService.get('sessions.secret'),
      resave: false,
      saveUninitialized: false, // allow start empty session on first http request and store it
      proxy: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        // domain: configService.get('web.domain'),
        sameSite: !isDev,
        secure: configService.get('web.protocol') === 'https', // require HTTPS in production
      },
    }),
  );

  /** App start */
  await app.listen(3000);
}
bootstrap();
