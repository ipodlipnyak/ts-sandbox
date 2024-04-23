<template>
  <v-app light>
    <v-app-bar name="header" app>
      Header
      <v-spacer />
      <v-btn v-if="loggedIn" @click.stop="logout" color="primary">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <!-- <v-footer name="footer" app>
      Footer
    </v-footer> -->
  </v-app>
</template>

<script lang="ts">
  import {defineComponent, ref, computed, getCurrentInstance, watch} from 'vue';
  import {storeToRefs} from 'pinia';
  import {useAuthStore} from '../../client/stores';

  export default defineComponent({
    setup(props, ctx) {
      const autStore = useAuthStore();
      const {logout} = autStore;
      const {loggedIn} = storeToRefs(autStore);

      return {
        loggedIn,
        logout,
      };
    },
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
