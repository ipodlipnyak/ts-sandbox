<template>
  <v-card color="teal" variant="tonal" :loading="eventsStore.eventsPending" height="500" type="flat">
    <v-toolbar>
      <v-toolbar-title>Events</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-plus" variant="tonal"></v-btn>
    </v-toolbar>
    <v-sheet class="overflow-auto" height="440">
      <v-timeline side="end">
        <v-timeline-item
          v-for="(event, i) in eventsList"
          :key="event?.id || i"
        >
        <v-card>{{ event.summary }}</v-card>
        </v-timeline-item>
      </v-timeline>
    </v-sheet>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useEventsStore } from '~/stores';

export default defineComponent({
  props: {
    calendarId: String,
  },

  setup(props, ctx) {
    const eventsStore = useEventsStore();
    const eventsList = computed(() => {
      return eventsStore.events.filter((event) => {
        return event.organizer?.email === props.calendarId;
      });
    });

    eventsStore.fetchAll();

    return {
      eventsStore,
      eventsList
    }
  },
})
</script>
