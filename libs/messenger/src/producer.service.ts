import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { TelegramMessageDto } from '@my/common/dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ActionsTypes } from './messenger.dto';


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

  async addToQueue(message: TelegramMessageDto, action: ActionsTypes = 'reply') {
    try {
      const payload = JSON.stringify(message);
      const buffer = Buffer.from(payload);

      const wsQueue = this.configService.get('rabbitmq.queue');
      await this.channelWrapper.sendToQueue(
        wsQueue,
        buffer,
      );

      try {
        await lastValueFrom(this.client.send(action, payload));
      } catch (e) {
        // this.logger.debug(`Can't deliver message: ${ message.text }`)
      }

      this.logger.debug(`Sended message: ${ message.text }`);

    } catch (e) {
      this.logger.warn(e);
    }
  }
}
