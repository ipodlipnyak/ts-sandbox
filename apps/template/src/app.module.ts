// import "reflect-metadata";
import { Module, Logger, CacheModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { load } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { controllers } from './controllers';
import { services } from './services';
import { HttpLoggerMiddleware } from './middleware';
import { commands } from './commands';
import { resolvers } from './models';
import { Context } from 'graphql-ws';
import { consoleSandbox } from '@sentry/utils';
import { GoogleModule } from '@my/google';
import { LLMModule } from '@my/llm';
// import { SentryModule, HttpLoggerMiddleware } from '@cg/sentry'; 
// import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load,
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('cache'),
        isGlobal: true,
        store: redisStore,
      }),
    }),
    GoogleModule.forRootAsync({                                                                      
      inject: [ConfigService],                                                                       
      useFactory: async (configService: ConfigService) => ({ ...configService.get('google') }),      
    }),
    LLMModule.forRootAsync({                                                                      
      inject: [ConfigService],                                                                       
      useFactory: async (configService: ConfigService) => ({ ...configService.get('llm') }),      
    }),
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
      debug: true,
      playground: true,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '../..', 'client/dist'),
      rootPath: join(__dirname, '../..', 'apps/template/client'),
    }),
    HttpModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('db'),
      }),
    }),
  ],
  controllers,
  providers: [...services, ...commands, ...resolvers, Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
