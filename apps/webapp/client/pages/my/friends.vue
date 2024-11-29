<template>
  <v-container>
    <my-friends-list />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {

    return {
    };
  },
})
</script>
