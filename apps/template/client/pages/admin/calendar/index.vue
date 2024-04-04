<template>
  <v-infinite-scroll :height="300" :items="eventsStore.calendars" :onLoad="load">
    <template v-for="(cal, index) in eventsStore.calendars" :key="cal.id">
      <v-list-item
        :subtitle="`${cal.description}`"
        :title="`${cal.summary}`"
      >
        <template v-slot:prepend>
          <v-icon class="bg-primary">mdi-calendar</v-icon>
        </template>

        <template v-slot:append>
          <v-btn
            icon="mdi-pencil"
            size="x-small"
            variant="tonal"
            :to="`/admin/calendar/${cal.id}/`"
          ></v-btn>
        </template>
      </v-list-item>
    </template>
  </v-infinite-scroll>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventsStore } from '@/stores/events';

export default defineComponent({
  setup() {
    const eventsStore = useEventsStore();
    eventsStore.fetchAllCalendars();
    const load = () => {
      return false;
    };

    return {
      eventsStore,
      load,
    };
  },
})
</script>