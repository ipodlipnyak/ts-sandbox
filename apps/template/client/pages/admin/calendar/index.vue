<template>
  <v-container>
    <v-skeleton-loader type="list-item" color="transparent" :loading="eventsStore.calendarsPending">
      <v-virtual-scroll height="calc(100vh - 188px)" :items="eventsStore.calendars">
        <template v-for="(cal, index) in eventsStore.calendars" :key="cal.id">
          <v-card
            :color="cal?.backgroundColor || ''"
            variant="tonal"
            class="pa-2 mb-2"
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
    </v-skeleton-loader>
  </v-container>
  
  <v-footer
    name="footer"
    app
  >
    <v-container>
      <v-btn size="large" prepend-icon="mdi-plus" block variant="flat" color="blue">Add new</v-btn>
    </v-container>
  </v-footer>
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