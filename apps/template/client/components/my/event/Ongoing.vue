<template>
  <v-card variant="tonal" color="amber" max-width="400">
    <v-toolbar>
      <v-toolbar-title>
        Ongoings
      </v-toolbar-title>
      <v-spacer />
      <v-btn @click="eventsStore.fetchOngoingEvents" :loading="eventsStore.ongoingEventsPending" icon="mdi-reload" variant="tonal" />
    </v-toolbar>

    <v-carousel
      v-model="indexInFocus"
      color="blue"
      progress="primary"
      :show-arrows="false"
      height="135"
      cycle
    >
      <v-fab-transition leave-absolute>
      <v-row
        v-if="eventsStore.ongoingEvents.length === 0"
        align="center"
        key="nope"
      >
        <v-col>
          <v-icon
            size="32"
            class="ml-8 mt-2"
            icon="mdi-google-downasaur"
          />
        </v-col>
        <v-col>
          <v-icon
            size="32"
            class="ml-8 mt-2"
            icon="mdi-cactus"
          />
        </v-col>
      </v-row>
      </v-fab-transition>

      <v-carousel-item v-for="(event, index) in eventsStore.ongoingEvents" :key="index">
        <div class="mt-7 px-4">
        <my-event-card
          show-time
          show-status
          :html-link="event.htmlLink"
          :summary="event.summary"
          :location="event.location"
          :start="event.start.dateTime"
          :end="event.end.dateTime"
        />
        </div>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script lang="ts">
import { useEventsStore } from '~/stores';


export default defineComponent({
  setup(props, ctx) {
    const eventsStore = useEventsStore();
    eventsStore.fetchOngoingEvents();
    const indexInFocus = ref(0);

    return {
      eventsStore,
      indexInFocus
    }
  },
})
</script>
