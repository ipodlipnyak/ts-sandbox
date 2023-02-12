<template>
  <NuxtPage />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  transition: 'fade-transition',
  scrollToTop: true,
  middleware: [
    // 'auth',
  ],
})
</script>
