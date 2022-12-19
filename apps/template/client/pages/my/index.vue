<template>
  <div></div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue'

  export default defineComponent({
    middleware(ctx) {
      // return ctx.redirect('/admin/db');
    },

    setup() {
      const display = useDisplay();
      const layout = useLayout();

      return {
        display,
      };
    },
  })
</script>