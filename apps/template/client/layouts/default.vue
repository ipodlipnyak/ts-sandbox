<template>
  <v-app light>
    <v-app-bar name="header" app>
      Header
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer name="footer" app>
      Footer
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import {defineComponent, ref, computed, getCurrentInstance, watch} from 'vue';

  export default defineComponent({
    //
  })
</script>

<style lang="scss" scoped>
  /*
@import '~vuetify/src/styles/styles.sass';
@import '@/assets/variables';
*/

  /*
  @import '@/assets/variables',
  '@/assets/transitions',
  '@/assets/colors',
  '@/assets/typography',
  '@/assets/shame';
*/

  /*
@debug $grid-breakpoints;
@debug $shades;
@debug map-get($shades, black);
*/
</style>