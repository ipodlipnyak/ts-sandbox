<template>
  <v-timeline side="end" align="start">
    <v-timeline-item v-for="event in eventsStore.allEvents" :key="event.id" :dot-color="event.color" size="small">

      <template v-slot:opposite>
        <div
          :class="`pt-1 headline font-weight-bold text-${event.color}`"
          v-text="event.start"
        ></div>
      </template>

      <my-event-card 
        :description="event.description"
        :html-link="event.htmlLink"
        :location="event.location"
        :color="event.color"
        :summary="event.summary"
      />
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { useEventsStore } from '@/stores/events';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {
    const display = useDisplay();
    const layout = useLayout();
    const authStore = useAuthStore();
    const usersStore = useUsersStore();
    const eventsStore = useEventsStore();
    
    eventsStore.fetchAll();

    return {
      display,
      authStore,
      usersStore,
      eventsStore,
    };
  },
})
</script>