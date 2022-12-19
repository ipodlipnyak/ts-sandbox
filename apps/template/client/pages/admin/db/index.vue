<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useActions, useGetters } from '@/plugins/vuex-helpers'

export default defineComponent({
  middleware(ctx) {
    return ctx.redirect('/admin/db/users/');
  }
})
</script>
