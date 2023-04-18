<template>
  <NuxtPage />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    definePageMeta({
      layout: 'my',
      scrollToTop: true,
      pageTransition: {
        name: 'fade-transition',
      },
      layoutTransition: {
        name: 'fade-transition',
      },
      middleware: [
        'auth',
      ],
    });
    return {};
  }
})
</script>
