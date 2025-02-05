import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BotModule } from './bot.module';

const RABBITMQ_URL = process.env?.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE = process.env?.RABBITMQ_QUEUE_TG || 'tgQueue';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BotModule, {
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
