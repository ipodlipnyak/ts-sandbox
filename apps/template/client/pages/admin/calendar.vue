<template>
    <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventsStore } from '@/stores/events';

export default defineComponent({
  setup() {
    const eventsStore = useEventsStore();
    eventsStore.fetchAllCalendars();

    return {
      //
    };
  },
})
</script>