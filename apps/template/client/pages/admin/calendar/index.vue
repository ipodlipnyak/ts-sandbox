<template>
  <v-container>
    <v-skeleton-loader type="list-item" color="transparent" :loading="eventsStore.calendarsPending">
      <v-card
        width="100%"
      >
        <v-toolbar>
          <v-toolbar-title>Calendars</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-plus" variant="tonal" to="/admin/calendar/new"></v-btn>
        </v-toolbar>

        <v-virtual-scroll height="calc(100vh - 200px)" :items="eventsStore.calendars">
          <template v-slot:default="{ item }">
            <v-card
              :color="item?.backgroundColor || ''"
              variant="tonal"
              class="pa-2 my-2 mx-4"
              :to="`/admin/calendar/${item.id}/`"
            >
              <v-row noGutters>
                <v-card-title>
                  {{ item?.summary }}
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn 
                  icon="mdi-pencil"
                  variant="tonal"
                ></v-btn>
              </v-row>
            </v-card>
          </template>

        </v-virtual-scroll>
      </v-card>
    </v-skeleton-loader>
  </v-container>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventsStore } from '@/stores/events';

export default defineComponent({
  setup() {
    const eventsStore = useEventsStore();
    eventsStore.fetchAllCalendars();
    
    return {
      eventsStore,
    };
  },
})
</script>