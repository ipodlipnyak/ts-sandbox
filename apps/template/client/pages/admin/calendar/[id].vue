<template>
    <div>{{ calId }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';

export default defineComponent({
  middleware(ctx) {
    return ctx.redirect('/admin/event');
  },

  setup() {
    const display = useDisplay();
    const route = useRoute();
    const calId = route.params.id;

    return {
      display,
      calId,
    };
  },
})
</script>