<template>
  <nuxt-child />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  transition: 'fade-transition',
  scrollToTop: true,
  middleware: [
    'auth',
    (ctx) => {
      ctx.store.dispatch('layout/resetToDefault');
    },
  ],
})
</script>
