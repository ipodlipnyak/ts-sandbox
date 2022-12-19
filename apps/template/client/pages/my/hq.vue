<template>
  <v-container>
    <alfa-title>Штаб</alfa-title>
    <alfa-card width="200" height="150">
      test
    </alfa-card>
  </v-container>
</template>

<script lang="ts">
  import {defineComponent, ref, computed, nextTick, getCurrentInstance, watch} from 'vue';
  import {useGetters, useActions, useState} from '@/plugins/vuex-helpers';

  export default defineComponent({
    transition: 'fade-transition',
    scrollToTop: true,
    middleware: [
      'auth',
      (ctx) => {
        ctx.store.dispatch('layout/resetToDefault');
      },
    ],
    setup(props, ctx) {
      const instance = getCurrentInstance();
      const root = instance?.proxy;

      return {
        //
      };
    }
  })
</script>

<style lang="scss" scoped>

</style>