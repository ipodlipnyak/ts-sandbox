<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <my-friends-confirmed />
      </v-col>
      <v-col cols="12" md="6">
        <my-friends-invited />
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
    myStore.fetchMyFriends();

    return {
      display,
      myStore,
    };
  },
})
</script>