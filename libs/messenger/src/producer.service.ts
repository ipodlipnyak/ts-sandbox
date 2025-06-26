import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { BotQueuePayloadDTO, TelegramMessageDto } from '@my/common/dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ActionsTypes } from './dto';


@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ProducerService.name);

  constructor(
    private configService: ConfigService,
    @Inject('tg-rmq-client') private readonly client: ClientProxy,
  ) {
    const connection = amqp.connect([this.configService.get('rabbitmq.url')]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue(
          this.configService.get('rabbitmq.queue'),
          { durable: true }
        );
      },
    });
  }

  async addToQueue(payload: BotQueuePayloadDTO, queue: string) {
    try {
      const payloadString = JSON.stringify(payload);
      const buffer = Buffer.from(payloadString);

      const wsQueue = this.configService.get('rabbitmq.queue');
      await this.channelWrapper.sendToQueue(
        wsQueue,
        buffer,
      );

      try {
        await lastValueFrom(this.client.send(queue, payloadString));
      } catch (e) {
        // this.logger.debug(`Can't reach broker to post payload: ${ payload }`)
      }

      this.logger.debug(`Payload posted to queue ${queue}: ${ payloadString }`);

    } catch (e) {
      this.logger.warn(e);
    }
  }
}
