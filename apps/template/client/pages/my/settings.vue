<template>
  <v-card class="ma-4 pa-4">
      <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1"
        label="Normal with hint text" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {
    const display = useDisplay();
    const layout = useLayout();
    const authStore = useAuthStore();
    const usersStore = useUsersStore();

    const password = ref('');
    const show1 = ref(false);
    const rules = {
      required: (value: string) => !!value || 'Required.',
      min: (v: string) => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => (`The email and password you entered don't match`),
    };

    return {
      rules,
      password,
      show1,
      display,
      authStore,
      usersStore,
    };
  },
})
</script>