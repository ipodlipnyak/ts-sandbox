<template>
  <div>
    <v-btn @click.stop="authStore.fetchUserData" color="red" dark>SLAP!</v-btn>
    <v-btn @click.stop="usersStore.fetchAll" color="green" dark>SLAP on you!</v-btn>
    <div>{{ authStore.fullName }}</div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useDisplay, useLayout} from 'vuetify';
  import {useAuthStore} from '@/stores/auth';
  import {useUsersStore} from '@/stores/users';

  export default defineComponent({
    middleware(ctx) {
      // return ctx.redirect('/admin/db');
    },

    setup() {
      const display = useDisplay();
      const layout = useLayout();
      const authStore = useAuthStore();
      const usersStore = useUsersStore();

      return {
        display,
        authStore,
        usersStore,
      };
    },
  })
</script>