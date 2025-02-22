import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
import { EventsGateway } from './events.gateway';
import { MessengerController } from './messenger.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CloudflareModule } from '@my/cloudflare';
import { TelegramService } from './telegram.service';
import { HttpModule } from '@nestjs/axios';
import { commands } from './commands';
import { CommonModule, telegramUsersProvider, usersProvider } from '@my/common';
import { dataSourceProvider } from '@my/common/models/dataSource.providers';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CommonModule,
    HttpModule,
    CloudflareModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('cache'),
        isGlobal: true,
        store: redisStore,
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'tg-rmq-client',
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [
                await configService.get('rabbitmq.url') as string,
              ],
              queue: await configService.get('rabbitmq.queueTg'),
            }
          }),
        }
      ]
    }),
  ],
  controllers: [
    MessengerController,
  ],
  providers: [ConsumerService, ProducerService, EventsGateway, TelegramService, ...commands, ...telegramUsersProvider, ...usersProvider, ...dataSourceProvider],
  exports: [ConsumerService, ProducerService, EventsGateway, TelegramService, ...commands],
})
export class MessengerModule { }
