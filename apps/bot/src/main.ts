import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BotModule } from './bot.module';
import { LogLevel } from '@nestjs/common';

const RABBITMQ_URL = process.env?.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE = process.env?.RABBITMQ_QUEUE_TG || 'tgQueue';

async function bootstrap() {
  /**
   * Here we are limiting logger levels to display
   *
   * @see https://docs.nestjs.com/techniques/logger#basic-customization
   */
  const loggerLevels = (process.env.LOGGER_LEVELS?.split(',') || ['log', 'error', 'warn', 'debug', 'verbose']) as LogLevel[];

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BotModule, {
    logger: loggerLevels,
    transport: Transport.RMQ,
    options: {
      urls: [ RABBITMQ_URL ],
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
}
bootstrap();
