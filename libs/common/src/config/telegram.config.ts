import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('telegram', () => {
  return {
    apikey: env.TG_APIKEY || '',
    chatid: env.TG_CHATID || '',
    secretkey: env.TG_SECRET_KEY || '',
    subnetList: env.TG_SUBNET_LIST?.split(',') || [],
  };
});
