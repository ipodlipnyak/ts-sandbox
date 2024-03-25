import {
    Injectable,
    Inject,
    ConsoleLogger,
    OnApplicationShutdown,
    LogLevel,
    Scope,
} from '@nestjs/common';
import { OAuth2Client, OAuth2ClientOptions, GoogleAuth } from 'google-auth-library';
import { google, Auth } from 'googleapis';

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    // 'https://www.googleapis.com/auth/compute',
    // 'https://www.googleapis.com/auth/calendar.readonly',
];

@Injectable({ scope: Scope.REQUEST })
export class GoogleService {
    private client: OAuth2Client;
    private auth: Auth.GoogleAuth;

    constructor(@Inject('MY_GOOGLE_OPTIONS') readonly opts?: any) {
        if (!(opts && opts.clientId)) {
            // console.log('options not found. Did you use GoogleModule.forRoot?');
            return;
        }
        this.client = new OAuth2Client(opts);
        this.auth = new google.auth.GoogleAuth({
            keyFile: opts.applicationCredentials,
            scopes: SCOPES,
        });
    }

    get ClientInstance() {
        return this.client;
    }

    get ClientId() {
        return this.client._clientId;
    }

    /**
     * Calendar api v3
     * @see https://developers.google.com/calendar/api/v3/reference
     */
    get calendarV3() {
        const auth = this.auth;
        const cal = google.calendar({
            version: 'v3',
            auth,
        });
        return cal;
    }

    /**
     * Accept an invitation and insert calendar to service account calendars list.
     * This method helps to subscribe service account to existing calendars from another accounts.
     * 
     * @param id calendar id with invitation
     * 
     * @see https://developers.google.com/calendar/api/v3/reference/calendarList/insert#python
     * @see https://stackoverflow.com/questions/26064095/inserting-google-calendar-entries-with-service-account
     */
    async addCalendar(id: string) {
        const response = await this.calendarV3.calendarList.insert({
            requestBody: {
                id
            },
        });
        return response.data;
    }

    async getCalendarList() {
        const response = await this.calendarV3.calendarList.list();
        return response.data.items;
    }

    /**
     * Invoke Google Cloud Functions
     *  
     * @param url Cloud Functions uses your function's url as the `targetAudience` value
     * @returns all that cloud function returns
     * 
     * @see https://cloud.google.com/functions/docs/securing/authenticating#functions-bearer-token-example-nodejs 
     */
    async invokeGCFunction(url: string) {
        const targetAudience = url;
        console.info(`request ${url} with target audience ${targetAudience}`);
        debugger
        const client = await this.auth.getIdTokenClient(url);
        const response = await client.request({url});
        return response.data;
    }
}
