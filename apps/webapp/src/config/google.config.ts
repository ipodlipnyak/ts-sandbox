import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('google', () => {
  return {
    clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    clientId: env.GOOGLE_CLIENT_ID || '',
    redirectUri: env.GOOGLE_REDIRECT_URI || '',

    /**
     * Used to call google api from backend with service account credentials 
     * @see https://github.com/googleapis/google-api-nodejs-client#service-account-credentials
     */
    applicationCredentials: env.GOOGLE_APPLICATION_CREDENTIALS || '',
    mainCalendarId: env.GOOGLE_MAIN_CALENDAR_ID || 'primary',
  };
});
