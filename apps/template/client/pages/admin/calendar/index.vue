<template>
  <v-container>
    <v-skeleton-loader type="list-item" color="transparent" :loading="eventsStore.calendarsPending">
      <v-card
        width="100%"
      >
        <v-toolbar>
          <v-toolbar-title>Calendars</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-plus" variant="tonal"></v-btn>
        </v-toolbar>

        <v-virtual-scroll height="calc(100vh - 200px)" :items="eventsStore.calendars">
          <template v-for="(cal, index) in eventsStore.calendars" :key="cal.id">
            <v-card
              :color="cal?.backgroundColor || ''"
              variant="tonal"
              class="pa-2 my-2 mx-4"
              :to="`/admin/calendar/${cal.id}/`"
            >
              <v-row noGutters>
                <v-card-title>
                  {{ cal?.summary }}
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
    
    const test = computed(() => {
      return Array(5).fill(0).map((el, index) =>{
        return {
          id: index,
          backgroundColor: 'red',
          summary: `Fuck#${index}`,
        };
      });
    });

    return {
      eventsStore,
      test
    };
  },
})
</script>