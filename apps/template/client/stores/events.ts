import { defineStore, acceptHMRUpdate } from 'pinia';
import { GoogleDateDto, RestListResponseDto } from '../../src/dto';
import { calendar_v3 } from 'googleapis';

function getPalette(baseColor: string) {
    const darken = Array(4).fill(0).map((el, i) => `${baseColor}-darken-${i + 1}`);
    let base = [
        baseColor,
        ...darken,
    ];
    let revers = [...base];
    revers.reverse().shift();
    return [
        ...base,
        ...revers
    ]
};

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
            const dtNow = new Date();

            let result = state.events.sort((a, b) => {
                return + new Date(a.start?.dateTime || '') < + new Date(b.start?.dateTime || '');
            }).map((event: calendar_v3.Schema$Event, index) => {

                const paletteFuture = getPalette('yellow');
                const paletteOngoing = getPalette('green');
                const palettePast = getPalette('red');

                const dtStart = new Date(event.start?.dateTime || '');
                const dtEnd = new Date(event.end?.dateTime || '');

                let eventStatus = 'future';
                let palette = paletteFuture;
                
                // past event check
                if (+dtEnd <= +dtNow) {
                    eventStatus = 'past';
                    palette = palettePast;
                }

                // ongoing event check
                if (+dtStart <= +dtNow && +dtEnd >= +dtNow) {
                    eventStatus = 'ongoing';
                    palette = paletteOngoing;
                }

                return {
                    ...event,
                    startFormatted: (new Date(event.start?.dateTime || '')).toLocaleString().slice(0,-3),
                    endFormatted: (new Date(event?.end?.dateTime || '')).toLocaleString().slice(0,-3),
                    color: palette[index%palette.length],
                    eventStatus,
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
