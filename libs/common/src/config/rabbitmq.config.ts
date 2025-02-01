import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('rabbitmq', () => {
  return {
    url: env.RABBITMQ_URL || 'amqp://localhost',
    queue: env.RABBITMQ_QUEUE || 'wsQueue', // websocket
    queueTg: env.RABBITMQ_QUEUE_TG || 'tgQueue', // telegram
  };
});
