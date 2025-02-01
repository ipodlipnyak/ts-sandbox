import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('web', () => {
  return {
    domain: env.WEB_DOMAIN || 'localhost',
    protocol: env.WEB_PROTOCOL || 'http',

    get url() {
      return `${this.protocol}://${this.domain}`;
    },
  };
});
