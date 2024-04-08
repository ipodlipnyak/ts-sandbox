<template>
  <v-container>
    <my-minecraft-status />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {
    const display = useDisplay();
    const layout = useLayout();
    const authStore = useAuthStore();

    return {
      display,
      authStore,
    };
  },
})
</script>