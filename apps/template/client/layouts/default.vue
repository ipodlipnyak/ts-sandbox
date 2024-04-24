<template>
  <v-app light>
    <v-app-bar
      class="py-1"
      scroll-behavior="fade-image"
      name="header"
      app
      color="#c5975cff"
    >
      <template v-slot:prepend>
        <v-img
          class="shadow"
          src="/sun.svg"
          :width="100"
        ></v-img>
      </template>

      <v-app-bar-title>
        Title
      </v-app-bar-title>

      <template v-slot:append>
        <my-google-sign-in-btn />
      </template>

      <!--
      <v-btn v-if="loggedIn" @click.stop="logout" color="primary">Logout</v-btn>
      -->
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
 .shadow {
  filter: drop-shadow( 1px 1px 1px rgba(0, 0, 0, .1));
 }
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
