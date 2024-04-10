<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <my-friends-accepted />
      </v-col>
      <v-col cols="12" md="4">
        <my-friends-followers />
      </v-col>
      <v-col cols="12" md="4">
        <my-friends-subscriptions />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useMyStore } from '~/stores';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {
    const display = useDisplay();
    const myStore = useMyStore();

    return {
      display,
      myStore,
    };
  },
})
</script>
