<template>
  <nuxt-child />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  transition: 'fade-transition',
  scrollToTop: true,
  layout: 'admin-panel',
  middleware: [
    'admin',
    (ctx) => {
      ctx.store.dispatch('layout/resetToDefault');
    },
  ],
})
</script>
