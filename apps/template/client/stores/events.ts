import { defineStore, acceptHMRUpdate } from 'pinia';
import { GoogleDateDto, RestListResponseDto } from '../../src/dto';
import { calendar_v3 } from 'googleapis';

export const useEventsStore = defineStore('events', {
    // arrow function recommended for full type inference
    state: () => ({
        events: [] as calendar_v3.Schema$Event[],
        eventsPending: false,
        calendars: [] as calendar_v3.Schema$CalendarListEntry[],
        calendarsPending: false,
    }),

    actions: {
        async fetchAll() {
            this.eventsPending = true;

            const { data, pending, error, refresh } = await useFetch('/api/calendar/event');
            const response = data.value as RestListResponseDto;
            if (response?.status === 'success') {
              this.events = response.payload || [];
            }

            this.eventsPending = false;
        },

        async fetchAllCalendars() {
            this.calendarsPending = true;

            const { data, pending, error, refresh } = await useFetch('/api/calendar/');
            const response = data.value as RestListResponseDto;
            if (response?.status === 'success') {
              this.calendars = response.payload || [];
            }
            
            this.calendarsPending = false;
        }
    },

    getters: {
        allEvents: (state) => {
            let result = state.events.sort((a, b) => {
                return + new Date(a.start?.dateTime || '') < + new Date(b.start?.dateTime || '');
            }).map((event: calendar_v3.Schema$Event, index) => {
            const palette = ['cyan','green', 'pink', 'amber','orange'];
                return {
                    ...event,
                    start: (new Date(event.start?.dateTime || '')).toLocaleString(),
                    end: (new Date(event?.end?.dateTime || '')).toLocaleString(),
                    color: palette[index%palette.length],
                    // color: palette[Math.floor(Math.random()*palette.length)],
                }
            });
            return result;
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useEventsStore, import.meta.hot));
}
