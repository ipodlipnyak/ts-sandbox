
<template>
  <div>
    <MyAssistantChat />
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