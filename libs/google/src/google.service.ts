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
import { GoogleCalendarAclDto, GoogleCalendarEventDto } from 'apps/template/src/dto';
import { randomUUID } from 'crypto';
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

type AclRolesType = 'owner' | 'writer' | 'reader' | 'freeBusyReader' | 'none';

enum ACL_ROLES_LEVEL {
    'owner' = 400,
    'writer' = 300,
    'reader' = 200,
    'freeBusyReader' = 100,
    'none' = 0,
}

const JITSI_MEET_URL = 'https://meet.jit.si/';

@Injectable({ scope: Scope.REQUEST })
export class GoogleService {
    private client: OAuth2Client;
    private auth: Auth.GoogleAuth;
    private authNoScope: Auth.GoogleAuth;
    private readonly logger: Logger;

    static MAIN_CALENDAR_ID = 'google.mainCalendarId';
    static CAHCE_KEY_EVENTS = 'google.events';
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
     * Check if user have enought rights for this calendar
     *
     * @param calendarId calendar to check
     * @param email user`s email
     * @param role target access level. By default reader. Possible: owner, writer, reader, freeBusyReader, none
     * @returns
     */
    async checkCalendarAccess(calendarId: string, email: string, role?: AclRolesType): Promise<boolean> {
        const roleToCheck = role || 'reader';

        const acl = await this.calendarV3.acl.list({
            calendarId,
        });
        const rule = acl.data.items.find((el) => el.scope.value === email);
        if (!rule) {
            return false;
        }

        const actualRole = rule.role;

        return ACL_ROLES_LEVEL[roleToCheck] >= ACL_ROLES_LEVEL[actualRole];
    }

    /**
     * Add new acl rule to user owned calendar
     *
     * @see https://developers.google.com/calendar/api/v3/reference/acl/insert#request-body
     * @param email
     * @param calendarId
     * @param acl
     * @returns
     */
    async addCalendarAclRule(email: string, calendarId: string, acl: GoogleCalendarAclDto) {
        const isAllowed = await this.checkCalendarAccess(calendarId, email, 'owner');

        if (!isAllowed) {
            throw new Error('Not allowed');
        }

        const value = acl.scope.value;
        if (!value) {
            throw new Error('Empty value field');
        }

        const response = await this.calendarV3.acl.insert({
          calendarId: calendarId,
          requestBody: {
            role: acl?.role || 'reader', // writer, owner, freeBusyReader, none
            scope: {
              type: acl?.scope?.type || 'user',
              value,
              // value: acl?.scope?.value || 'default',
            }
          }
        });

        return response.data;
    }

    /**
     * clear cache from all related to calendar keys
     */
    async cacheDelCalendar() {
        await this.cacheDelCalendarACL();
        await this.cacheDelCalendarList();
        const allKeys = await this.cacheManager.store.keys(`${GoogleService.CAHCE_KEY_EVENTS}*`) as string[];
        await Promise.all(allKeys.map(async (key) => {
            await this.cacheManager.del(key);
        }));
    }

    getCacheKeyUserEvents(email: string) {
        return `${GoogleService.CAHCE_KEY_EVENTS}.${email}`;
    }

    async cacheDelUserEvents(email: string) {
        await this.cacheManager.del(this.getCacheKeyUserEvents(email));
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

    /**
     * Get list of last 10 events for every calendar
     * from last month and until next second month
     *
     * @see https://developers.google.com/calendar/api/v3/reference/events/list
     * @param email user's email
     * @returns
     */
    async getUserEventsList(email: string) {
        let result = null as calendar_v3.Schema$Event[] | null;

        const key = this.getCacheKeyUserEvents(email);
        result = await this.cacheManager.get(key);
        if (result) {
            return result;
        }

        const calendarsList = await this.getUserCalendarsIDList(email);

        const allPromises = calendarsList.map(async (calendarId) => {
            const calEventsList = await this.calendarV3.events.list({
              calendarId,
              orderBy: 'startTime', // ascend by default
              singleEvents: true, // return single one-off events and instances of recurring events
              maxResults: 10,
              // timeMax: (new Date(+new Date() + 1000 * 3600 * 24 * 61)).toISOString(), // two months ahead
              timeMin: (new Date(+new Date() - 1000 * 3600 * 24 * 2)).toISOString(), // 2 days ago
            });
            return calEventsList.data.items;
        });

        await Promise.all(allPromises).then((values) => {
            result = [];
            values.forEach((calEventList) => {
                result = [...result, ...calEventList];
            })
        });

        await this.cacheManager.set(key, result, {
            ttl: 5, // for 5 sec. Just to prevent spamming
        });
        return result;
    }

    /**
     * Show soon to start or already in progress event
     *
     * @param email
     * @returns
     */
    async getUserEventOngoing(email: string) {
        let result = null as calendar_v3.Schema$Event | null;

        const calendarsIdList = await this.getUserCalendarsIDList(email);
        const calendarList = await this.getUserCalendarsList(email);

        const allPromises = calendarsIdList.map(async (calendarId) => {
            const calEventsList = await this.calendarV3.events.list({
              calendarId,
              orderBy: 'startTime', // ascend by default
              singleEvents: true, // return single one-off events and instances of recurring events
              maxResults: 10,
              // timeMax: (new Date(+new Date() + 1000 * 3600 * 24)).toISOString(), // day ahead
              timeMin: (new Date(+new Date() - 1000 * 3600 * 1)).toISOString(), // hour ago
            });
            const events = calEventsList.data.items;
            return {
              calendar: calendarList.find((cal) => cal.id === calendarId),
              calendarId,
              event: events.reverse().shift()
            }
        });

        const eventsList = await Promise.all(allPromises);
        const ongoing = eventsList.filter((el) => !! el?.event).sort((a, b) => {
          return +new Date(a.event.start.dateTime) - +new Date(b.event.start.dateTime);
        });

        // const calendarId: string = cal.calendarId;
        // const event: calendar_v3.Schema$Event = cal.event;

        return ongoing;
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

        if (!event.summary) {
            throw new Error('No title in summary field for event');
        }

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
                location: `${JITSI_MEET_URL}CertainHistoriesPowerHumbly/${encodeURIComponent(randomUUID())}`
                // location: event.location || '',
                // attendees: event.attendees || [],
              }
            });

            /**
             * clean the cache before inform the user about created event,
             * so he can request a fresh event list later
             */
            await this.cacheDelUserEvents(email);

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
