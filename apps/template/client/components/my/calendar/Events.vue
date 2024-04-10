<template>
  <v-card color="teal" variant="tonal" :loading="eventsStore.eventsPending" height="500" type="flat">

    <v-toolbar>
      <v-toolbar-title>Events</v-toolbar-title>
      <v-spacer />
      <v-btn
        icon="mdi-refresh"
        :loading="eventsStore.eventsPending"
        @click="eventsStore.fetchAll"
        variant="tonal"
      ></v-btn>
    </v-toolbar>

    <v-sheet class="overflow-auto px-4" height="440">
      <v-timeline side="end">

        <v-timeline-item
          dot-color="info"
        >
          <template v-slot:opposite>
            <v-text-field
              label="Start date"
              type="date"
              v-model="newEventStartDate"
            ></v-text-field>

            <v-text-field
              label="Start time"
              type="time"
              v-model="newEventStartTime"
            ></v-text-field>
          </template>
          <v-card width="125">
            <v-text-field hide-details label="Title" v-model="newEventName"></v-text-field>
            <v-card-actions>
              <v-btn 
                :disabled="createEventPending"
                :loading="createEventPending"
                @click="createEvent"
                icon="mdi-plus"
                block
                variant="tonal"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-timeline-item>

        <v-timeline-item
          v-for="(event, i) in eventsList"
          :key="event?.id || i"
          :dot-color="event.color"
        >
          <template v-slot:opposite>
            <span>{{ event.startFormatted }}</span>
          </template>
        <v-card :href="event?.htmlLink || ''" target="_blank_" class="pa-2">{{ event.summary }}</v-card>
        </v-timeline-item>
      </v-timeline>
    </v-sheet>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useEventsStore } from '~/stores';
import type { GoogleCalendarEventDto } from '../../../../src/dto';

function getInputDateNow() {
  const now = new Date();
  const [date, time] = now.toISOString().split('T');
  const [hour, minute, seconds] = time.split(':');
  return {
    date,
    hour,
    minute,
    seconds
  };
}

export default defineComponent({
  props: {
    calendarId: String,
  },

  setup(props, ctx) {
    const eventsStore = useEventsStore();
    const eventsList = computed(() => {
      return eventsStore.allEvents.filter((event) => {
        return event.organizer?.email === props.calendarId;
      })
    });

    const newEventName = ref('');
    const now = getInputDateNow();
    const newEventStartTime = ref(`${now.hour}:00`);
    const newEventStartDate = ref(now.date);
    const dtStartUTC = computed(() => {
      return (new Date(`${newEventStartDate.value}T${newEventStartTime.value}`)).toISOString();
    });
    
    const createEventPending = ref(false);
    const createEvent = async () => {
      const calId = props.calendarId;
      if (!calId) {
        return;
      }
      createEventPending.value = true;

      const body: GoogleCalendarEventDto = {
        calendarId: calId,
        summary: newEventName.value,
        description: '',
        location: '',
        start: {
          dateTime: dtStartUTC.value,
          timeZone: ''
        },
        end: {
          dateTime: '',
          timeZone: ''
        },
        attendees: []
      };

      const { data } = await useFetch(`/api/calendar/event`, {
        method: 'post',
        body,
      });

      createEventPending.value = false;
      eventsStore.fetchAll();
    };

    eventsStore.fetchAll();

    return {
      eventsStore,
      eventsList,
      createEvent,
      createEventPending,
      newEventName,
      newEventStartTime,
      newEventStartDate,
    }
  },
})
</script>
