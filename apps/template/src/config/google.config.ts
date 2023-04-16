import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('google', () => {
  return {
    clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    clientID: env.GOOGLE_CLIENT_ID || '',
    redirectURI: env.GOOGLE_REDIRECT_URI || '',
  };
});
