<template>
  <v-app id="inspire">
    <v-system-bar>
      <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>

    </v-system-bar>

    <v-navigation-drawer
      absolute
      rail
    >
      <v-avatar
        class="d-block text-center mx-auto mt-4"
        color="grey-darken-1"
        size="36"
      ></v-avatar>

      <v-divider class="mx-3 my-5"></v-divider>

      <v-avatar
        v-for="n in 6"
        :key="n"
        class="d-block text-center mx-auto mb-9"
        color="grey-lighten-1"
        size="28"
      ></v-avatar>
    </v-navigation-drawer>

    <v-navigation-drawer
      width="244"
    >
      <v-sheet
        height="128"
        width="100%"
      ></v-sheet>

      <v-list>
<!--         <v-list-item
          v-for="n in 5"
          :key="n"
          :title="`Item ${ n }`"
          link
        >
        </v-list-item> -->
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          exact
          to="/my/"
        />
        <v-list-item
          title="Bot"
          prepend-icon="mdi-robot-happy"
          to="/my/bot"
        />
        <v-list-item
          title="Settings"
          prepend-icon="mdi-cog"
          to="/my/settings"
        />
        <v-list-item
          title="Events"
          prepend-icon="mdi-calendar"
          to="/my/events"
        />
        
        <v-list-item
          title="Logout"
          @click.stop="logout"
          prepend-icon="mdi-logout"
          color="secondary"
          variant="elevated"
          :active="true"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="pr-4">
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          bg-color="grey-lighten-2"
          class="rounded-pill overflow-hidden"
          density="compact"
          hide-details
          variant="solo"
        ></v-text-field>
      </v-responsive>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <!--
    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          :title="`Item ${ n }`"
          link
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    -->

    <!-- <v-footer
      app
      height="72"
    >
      <v-text-field
        bg-color="grey-lighten-1"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
      ></v-text-field>
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