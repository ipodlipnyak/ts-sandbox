<template>
  <v-app key="layoutMy">
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
      :model-value="mobile ? showNavBar : true"
      @update:model-value="showNavBar = $event"
    >
      <v-sheet
        v-if="!mobile"
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
          :key="item.title"
        </v-list-item> -->
        <v-list-item
          v-for="item in navTree"
          :to="item.path"
          :title="item.title"
          :prepend-icon="item.icon"
          :color="item?.color"
          exact
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
      <v-app-bar-nav-icon
        v-if="mobile"
        @click.stop="showNavBar = !showNavBar"
      />

      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          type="search"
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
  import { useDisplay } from 'vuetify';

  export default defineComponent({
    setup(props, ctx) {
      const { width, mobile } = useDisplay()

      const authStore = useAuthStore();
      const {logout} = authStore;
      const {loggedIn} = storeToRefs(authStore);
      const myNavTree = [
        {
          title: 'Dashboard',
          path: '/my',
          icon: 'mdi-view-dashboard'
        },
        {
          title: 'Bot',
          path: '/my/bot',
          icon: 'mdi-robot-happy'
        },
        {
          title: 'Settings',
          path: '/my/settings',
          icon: 'mdi-cog'
        },
        {
          title: 'Events',
          path: '/my/events',
          icon: 'mdi-calendar'
        },
      ];

      const adminNavTree = [
        {
          title: 'Calendars',
          path: '/admin/calendar',
          icon: 'mdi-calendar'
        },
      ];

      const navTree = computed(() => {
        let result = myNavTree.map((el) => {
          return {
            ...el,
            color: 'green',
          }
        });
        if (authStore.isAdmin) {
          result = [
            ...result,
            ...adminNavTree.map((el) => {
              return {
                ...el,
                color: 'amber',
              }
            }),
          ];
        }
        return result;
      });

      const showNavBar = ref(false);

      return {
        mobile,
        showNavBar,
        navTree,
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