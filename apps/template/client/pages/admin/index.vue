<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  middleware(ctx) {
    return ctx.redirect('/admin/db');
  }
})
</script>
