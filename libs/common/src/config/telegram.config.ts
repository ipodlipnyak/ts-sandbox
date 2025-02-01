import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('telegram', () => {
  return {
    apikey: env.TG_APIKEY || '',
    chatid: env.TG_CHATID || '',
  };
});
