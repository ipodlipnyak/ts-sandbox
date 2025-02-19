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
import { CryptoService } from '@my/common/services';
import { telegramUsersProvider, usersProvider } from '@my/common';
import { dataSourceProvider } from '@my/common/models/dataSource.providers';

@Module({
  imports: [
    HttpModule,
    CloudflareModule,
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
  providers: [CryptoService, ConsumerService, ProducerService, EventsGateway, TelegramService, ...commands, ...telegramUsersProvider, ...usersProvider, ...dataSourceProvider],
  exports: [ConsumerService, ProducerService, EventsGateway, TelegramService, ...commands],
})
export class MessengerModule { }
