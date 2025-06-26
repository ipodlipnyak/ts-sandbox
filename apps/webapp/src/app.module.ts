// import "reflect-metadata";
import { Module, Logger, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { controllers } from './controllers';
import { HttpLoggerMiddleware } from '@my/common/middleware';
import { commands } from './commands';
import { Context } from 'graphql-ws';
import { CloudflareModule } from '@my/cloudflare';
import { resolvers } from './resolvers';
import { GoogleModule } from '@my/google';
import { LLMModule } from '@my/llm';
import { CommonModule } from '@my/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { MessengerModule } from '@my/messenger';
// import { consoleSandbox } from '@sentry/utils';
// import { SentryModule, HttpLoggerMiddleware } from '@my/sentry';
// import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { services } from '@my/common/services';

let imports = [
  CacheModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      ...configService.get('cache'),
      isGlobal: true,
      store: redisStore,
    }),
  }),
  CommonModule,
  MessengerModule,
  GoogleModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({ ...configService.get('google') }),
  }),
  LLMModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({ ...configService.get('llm') }),
  }),
  CloudflareModule,
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    // subscriptions: {
    //   'graphql-ws': true
    // },
    subscriptions: {
      'graphql-ws': {
        onConnect: (context: Context<any>) => {
          const { connectionParams, extra } = context;
          // user validation will remain the same as in the example above
          // when using with graphql-ws, additional context value should be stored in the extra field
          // extra.user = { user: {} };
        },
      },
    },
    context: ({ extra }) => {
      // you can now access your additional context value through the extra field
    },
    // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    autoSchemaFile: true,
    debug: !!process.env?.DEBUG,
    playground: !!process.env?.DEBUG,
    // plugins: [ApolloServerPluginLandingPageLocalDefault()],
  }),
  HttpModule,
];

/**
 * In development we are running client as separate application,
 * which routing its calls to webapp api.
 * And no static files will be compiled in dist folder.
 * So if we will keep this module running in this environment,
 * we will recieve errors about empty dist folder.
 * So lets just keep it down until we need it.
*/

if (process.env?.NODE_ENV !== 'development') {
  imports = [
    ...imports,
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '../..', 'client/dist'),
      // rootPath: join(__dirname, '../..', 'apps/webapp/client'),
      // rootPath: join(__dirname, '../', 'client'),
      // rootPath: join(__dirname, '../../../../apps/webapp/', 'client/dist'),
      rootPath: join(__dirname, '../', 'client'),
    }),
  ];
}
@Module({
  imports,
  controllers,
  providers: [...commands, ...resolvers],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
