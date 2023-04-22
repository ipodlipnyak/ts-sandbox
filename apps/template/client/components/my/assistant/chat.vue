<template>
  <div>
    <v-footer
      app
      height="72"
    >
      <v-text-field
        bg-color="grey-lighten-1"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
      ></v-text-field>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { useAssistantStore } from '~/stores/assistant';

export default defineComponent({
  setup(props, ctx) {
    const assistantStore = useAssistantStore();
    const {pending, lastResponseText, input, inputLog, outputLog} = assistantStore; 

    return {
    }
  },
})
</script>
