<template>
    <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useFriendsStore } from '~/stores';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {
    const display = useDisplay();
    const friendsStore = useFriendsStore();
    friendsStore.fetchAll();


    return {
      display,
    };
  },
})
</script>