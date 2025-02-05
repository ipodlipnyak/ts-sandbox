import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
import { EventsGateway } from './events.gateway';
import { MessengerController } from './messenger.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CloudflareModule } from '@my/cloudflare';

@Module({
  imports: [
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
  providers: [ConsumerService, ProducerService, EventsGateway],
  exports: [ConsumerService, ProducerService, EventsGateway],
})
export class MessengerModule { }
