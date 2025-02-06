import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('logger', () => {
  return {
    levels: env.LOGGER_LEVELS?.split(',') || ['log', 'error', 'warn', 'debug', 'verbose'],
  };
});
