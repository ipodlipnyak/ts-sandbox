import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
    Injectable,
    Inject,
    ConsoleLogger,
    OnApplicationShutdown,
    LogLevel,
    Scope,
    Logger,
} from '@nestjs/common';
import { GoogleCalendarEventDto } from 'apps/template/src/dto';
import { OAuth2Client, OAuth2ClientOptions, GoogleAuth } from 'google-auth-library';
import { google, Auth, calendar_v3 } from 'googleapis';

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    // 'https://www.googleapis.com/auth/calendar.readonly',
    // 'https://www.googleapis.com/auth/compute',
];

type CalToACLItemType = {
    calendarId: string,
    acl: calendar_v3.Schema$Acl,
}

@Injectable({ scope: Scope.REQUEST })
export class GoogleService {
    private client: OAuth2Client;
    private auth: Auth.GoogleAuth;
    private authNoScope: Auth.GoogleAuth;
    private readonly logger: Logger;
    
    static MAIN_CALENDAR_ID = 'google.mainCalendarId';
    static CACHE_KEY_ALL_CALENDARS = 'google.allCalendars';
    static CACHE_KEY_ALL_CALENDARS_ACL = 'google.allCalendarsACL';

    constructor(
        @Inject('MY_GOOGLE_OPTIONS') readonly opts?: any,
        @Inject(CACHE_MANAGER) private cacheManager?: Cache,
    ) {
        if (!(opts && opts.clientId)) {
            // console.log('options not found. Did you use GoogleModule.forRoot?');
            return;
        }
        this.client = new OAuth2Client(opts);
        this.auth = new google.auth.GoogleAuth({
            keyFile: opts.applicationCredentials,
            scopes: SCOPES,
        });

        this.authNoScope = new google.auth.GoogleAuth({
            keyFile: opts.applicationCredentials,
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

    /**
     * clear cache from all related to calendar keys
     */
    async cacheDelCalendar() {
        await this.cacheDelCalendarACL();
        await this.cacheDelCalendarList();
    }

    /**
     * clear cache only from calendars acl key
     */
    async cacheDelCalendarACL() {
        await this.cacheManager.del(GoogleService.CACHE_KEY_ALL_CALENDARS_ACL);
    }

    /**
     * clear cache only from calendars list key
     */
    async cacheDelCalendarList() {
        await this.cacheManager.del(GoogleService.CACHE_KEY_ALL_CALENDARS);
    }

    /**
     * Get all calendars accessible for service account
     * Result is cachable
     * 
     * @returns google calendars list
     */
    async getCalendarList() {
        let result = null as calendar_v3.Schema$CalendarListEntry[] | null;
        result = await this.cacheManager.get(GoogleService.CACHE_KEY_ALL_CALENDARS) as calendar_v3.Schema$CalendarListEntry[];
        if (result) {
            return result;
        }

        const response = await this.calendarV3.calendarList.list();
        result = response.data.items;

        await this.cacheManager.set(GoogleService.CACHE_KEY_ALL_CALENDARS, result, {
            ttl: 24 * 1000 * 3600, // one day
        });
        return result; 
    }

    /**
     * Get list of acl rules for each calendar accessible for service account
     * Result is cachable
     * 
     * @returns map of calendar Id to ACL list
     */
    async getAllCaledarsACL() {
        let result = null as CalToACLItemType[] | null;

        result = await this.cacheManager.get(GoogleService.CACHE_KEY_ALL_CALENDARS_ACL);
        if (result) {
            return result;
        }

        const allCalendars = await this.getCalendarList();
        const promisesList = allCalendars.map(async (calendar) => {
            const response = await this.calendarV3.acl.list({
              calendarId: calendar.id,
            });

            const payload = response.data;
            return {
                calendarId: calendar.id,
                acl: payload
            }
        });

        await Promise.all(promisesList).then((values) => {
            result = values
        });

        await this.cacheManager.set(GoogleService.CACHE_KEY_ALL_CALENDARS_ACL, result, {
            ttl: 24 * 1000 * 3600, // one day
        });

        return result;
    }

    /**
     * Create new calendar with owner access rights for a specific user
     * as well as for a service account
     * 
     * @see https://developers.google.com/calendar/api/v3/reference/calendars/insert
     * @see https://developers.google.com/calendar/api/v3/reference/acl/insert
     *  
     * @param email user who will have owner rights to access calendar
     * @param title title of the calendar. Use eamil as a title if ommited
     * @param timeZone the time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".) Optional 
     * @returns new google calendar resource
     */
    async createCalendarForUser(email: string, title?: string, timeZone?: string) {
        let summary = title || email ;

        const newCalendarResponse = await this.calendarV3.calendars.insert({
          requestBody: {
            summary,
            timeZone: timeZone || 'Europe/Moscow',
          }
        });

        const newCalendar = newCalendarResponse.data;

        const newAclResponse = await this.calendarV3.acl.insert({
          calendarId: newCalendar.id,
          requestBody: {
            role: 'owner', // writer, owner, freeBusyReader, none
            scope: {
              type: 'user',
              value: email,
            }
          }
        });

        await this.cacheDelCalendar();

        return newCalendar;
    }

    async deleteCalendar(id: string) {
        const response = await this.calendarV3.calendars.delete({
          calendarId: id,
        });
        if (response.status !== 204) {
            // console.error(response);    
            // return
        }
        this.cacheDelCalendar();
    }

    /**
     * Get list of calendar ids user can access
     * 
     * @param email user's email
     * @returns 
     */
    async getUserCalendarsIDList(email: string) {
        const allCalsAclRules = await this.getAllCaledarsACL();
        const filterCalsIDList = allCalsAclRules.filter((el) => {
            return !! el.acl.items.find((acl) => acl.scope.value === email);
        });
        return filterCalsIDList.map(el => el.calendarId);
    }

    /**
     * Get list of calendars user can access
     * 
     * @param email user's email
     * @returns 
     */
    async getUserCalendarsList(email: string) {
        const allCals = await this.getCalendarList();
        const userCalsIdList = await this.getUserCalendarsIDList(email);
        const userCals = allCals.filter((cal) => {
            return userCalsIdList.find((id) => cal.id === id);
        });
        return userCals;
    }

    async getUserEventsList(email: string) {
        let result = [];

        const calendarsList = await this.getUserCalendarsIDList(email);

        const allPromises = calendarsList.map(async (calendarId) => {
            const calEventsList = await this.calendarV3.events.list({ calendarId });
            return calEventsList.data.items;
        });

        await Promise.all(allPromises).then((values) => {
            values.forEach((calEventList) => {
                result = [...result, ...calEventList];
            })
        });

        return result as calendar_v3.Schema$Event[];
    }

    /**
     * Create new event for a user
     * 
     * @param email user who allowed to manage this calendar
     * @param calendarId google calendar id
     * @param event event body
     * @returns new google event resource
     */
    async createNewUserEvent(email: string, calendarId: string, event: GoogleCalendarEventDto) {
        const allowedCalendars = await this.getUserCalendarsIDList(email);
        const isAllowed = !! allowedCalendars.find((id) => id === calendarId);
        if (!isAllowed) {
            throw new Error('Not allowed');
        }

        let { start, end } = event;
        if (!end.dateTime) {
            // create a 1 hour long event
            const dtStart = new Date(start.dateTime);
            const dtEnd = new Date(+ dtStart + 1000 * 60 * 60);
            end.dateTime = dtEnd.toISOString();
        }

        try {
            const response = await this.calendarV3.events.insert({
              calendarId,
              requestBody: {
                start: event.start || undefined,
                end: event.end || undefined,
                summary: event.summary || '',
                description: event.description || '',
                // location: event.location || '',
                // attendees: event.attendees || [],
              }
            });
            return response.data;
        } catch(error) {
            this.logger.error(error);
        }
    }

    /**
     * Invoke Google Cloud Functions
     *  
     * @param url Cloud Functions uses your function's url as the `targetAudience` value
     * @returns all that cloud function returns
     * 
     * @see https://cloud.google.com/functions/docs/securing/authenticating#functions-bearer-token-example-nodejs 
     */
    async invokeGCFunction(url: string, data?: any) {
        const client = await this.authNoScope.getIdTokenClient(url);
        const response = await client.request({method: "POST", url, data});
        return response.data;
    }
}
