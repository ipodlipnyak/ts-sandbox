<template>
  <div>
    <bl-balance :value="userData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// <bl-balance />
export default defineComponent({
  props: {
    userData: {
      type: Object,
      default: undefined,
    },
  },
  setup() {
    //
  },
})
</script>