import { registerAs } from '@nestjs/config';
import { env, isDev } from './environment';

export default registerAs('sentry', () => {
  return {
    dsn: env.SENTRY_DSN || '',
  };
});
