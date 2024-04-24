<template>
  <v-card
    height="400"
    class="pa-8 v-col-12 v-col-md-8"
    variant="tonal"
    color="#c5975cff"
    elevation="4"
  >
    <iframe
      width="100%"
      height="100%"
      frameborder="0"
      src="https://www.youtube.com/embed/tgbNymZ7vqY?playlist=tgbNymZ7vqY&loop=1&autoplay=1&mute=1">
    </iframe>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';

export default defineComponent({
  setup(props, ctx) {
    const message = ref('This is a message')
    const messageComputed = computed(() => {
      return 'test'
    })
    const display = useDisplay();
    const layout = useLayout();
    const authStore = useAuthStore();
    const usersStore = useUsersStore();

    return {
      message,
      messageComputed,
      display,
      layout,
    }
  },
})
</script>

<style lang="scss" scoped>
.v-card {
  backdrop-filter: blur(30px);
}
</style>

