<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <my-minecraft-status />
      </v-col>
      <v-col cols="12" md="4">
        <my-event-ongoing />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {
    const display = useDisplay();
    const layout = useLayout();

    return {
      display,
    };
  },
})
</script>
