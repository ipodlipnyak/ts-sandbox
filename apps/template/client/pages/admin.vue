<template>
  <NuxtPage />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    definePageMeta({
      layout: 'my',
      scrollToTop: true,
      pageTransition: {
        // name: 'scroll-x-transition',
        name: 'fade-transition',
        mode: 'out-in'
        // duration: {
        //   enter: 1000,
        //   leave: 0,
        // },
      },
      layoutTransition: {
        name: 'fade-transition',
      },
      middleware: [
        'auth',
        'admin',
      ],
    });
    return {};
  }
})
</script>
