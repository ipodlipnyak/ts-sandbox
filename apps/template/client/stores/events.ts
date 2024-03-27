import { defineStore, acceptHMRUpdate } from 'pinia';
import { RestListResponseDto } from '../../src/dto';

type EventDto = {
    id: string;
    status: string;
    htmlLink: string;
    summary: string;
    description: string;
    location: string;
    start: {
        dateTime: string;
        timeZone: string;
    }
    end: {
        dateTime: string;
        timeZone: string;
    }
}

export const useEventsStore = defineStore('events', {
    // arrow function recommended for full type inference
    state: () => ({
        events: [] as any[],
    }),
    actions: {
        async fetchAll() {
            /*
            const data: RestListResponseDto = await $fetch('/api/calendar/event');
            if (data?.status === 'success') {
              this.events = data.payload || [];
            }
            */

            const { data, pending, error, refresh } = await useFetch('/api/calendar/event');
            const response = data.value as RestListResponseDto;
            if (response?.status === 'success') {
              this.events = response.payload || [];
            }
        }
    },

    getters: {
        allEvents: (state): any[] => {
            let result = state.events.map((event: EventDto, index) => {
            const palette = ['cyan','green', 'pink', 'amber','orange'];
                return {
                    ...event,
                    start: (new Date(event.start.dateTime)).toLocaleString(),
                    end: (new Date(event.end.dateTime)).toLocaleString(),
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
