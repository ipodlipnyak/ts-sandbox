<template>
  <div>
    {{ heightComputed }}
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed, getCurrentInstance} from 'vue';

  export default defineComponent({
    transition: 'scroll-x-transition',
    // layout: 'landing',
    middleware(ctx) {
      if (ctx.store.getters['auth/loggedIn']) {
        ctx.redirect('/catalog');
      } else {
        ctx.store.commit('layout/SET_FOOTER_ABSOLUTE', false);
      }
    },
    setup() {
      const { $vuetify } = useNuxtApp();
      debugger;
      const instance = getCurrentInstance();
      const root = instance?.proxy;

      const heightComputed = computed(() => {
        let result =`calc(100vh - ${$vuetify?.application?.footer || 100}px)`;
        const screenHeight = $vuetify?.breakpoint?.height || 0;
        if (screenHeight < 630) {
          result = '400';
        }
        return result;
      });
      return {
        heightComputed,
        $vuetify,
      };
    },
  })
</script>

<style lang="scss" scoped>
.v-sheet {
  text-shadow: grey 1px 0 10px;
}
</style>
