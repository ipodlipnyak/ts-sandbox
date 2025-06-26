import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { TelegramMessageDto } from '@my/common/dto';
import { EventsGateway } from './events.gateway';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private configService: ConfigService,
    private eventsGateway: EventsGateway,
  ) {
    const connection = amqp.connect([this.configService.get('rabbitmq.url')]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.configService.get('rabbitmq.queue'), { durable: true });

        await channel.consume(this.configService.get('rabbitmq.queue'), async (payload) => {
          if (payload) {
            const message: TelegramMessageDto = JSON.parse(payload.content.toString());
            this.logger.debug(`Received message: ${ message.text || '' }`);

            this.eventsGateway.server.emit('events', message.text);
            channel.ack(payload);
          }
        });
      });
    } catch (e) {
      this.logger.debug(e);
    }
  }
}
