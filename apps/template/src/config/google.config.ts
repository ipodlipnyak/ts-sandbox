import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('google', () => {
  return {
    clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    clientId: env.GOOGLE_CLIENT_ID || '',
    redirectUri: env.GOOGLE_REDIRECT_URI || '',
  };
});
