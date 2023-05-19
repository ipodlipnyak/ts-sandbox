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

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

@Injectable({ scope: Scope.REQUEST })
export class GoogleService {
    private client: OAuth2Client;
    // private auth: Auth.OAuth2Client;
    private auth: Auth.GoogleAuth;

    constructor(@Inject('MY_GOOGLE_OPTIONS') readonly opts?: any) {
        if (!(opts && opts.clientId)) {
            // console.log('options not found. Did you use GoogleModule.forRoot?');
            return;
        }
        this.client = new OAuth2Client(opts);
        // this.auth = new google.auth.OAuth2(opts);
        this.auth = new google.auth.GoogleAuth({
            keyFile: opts.applicationCredentials,
            scopes: SCOPES, 
        })
    }

    get ClientInstance() {
        return this.client;
    }
    
    get ClientId() {
        return this.client._clientId;
    }

    async getCalendar(): Promise<any[]> {
        // const auth = this.auth;
        const auth = this.auth;
        const cal = google.calendar({
            version: 'v3',
            auth,
        });
        const result = await cal.calendarList.list();
        return [result];
    }
}
