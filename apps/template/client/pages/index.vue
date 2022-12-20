<template>
  <v-sheet width="100%" class="fill-height" color="blue">
    <v-img src="https://i.imgur.com/2wD3VJA.jpg" :height="heightComputed" cover>
    <v-row class="fill-height" no-gutters justify="center" align="center">
      <v-card color="transparent" width="600" flat>
        <v-card-title class="text-h3 text-uppercase mb-6 white--text">
          blah blah
        </v-card-title>

        <v-card-subtitle class="mb-1 text-body-1 font-weight-medium white--text">
          Eveniet culpa consequuntur natus sapiente numquam aut et ab
        </v-card-subtitle>

        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :large="display.smAndDown" :x-large="display.mdAndUp" depressed to="/login"
                nuxt class="px-8" dark color="green" block>
                Войти
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :large="display.smAndDown" :x-large="display.mdAndUp" depressed
                to="/signup" nuxt class="px-8" color="orange" dark block>
                Зарегистрироваться
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>
    </v-img>
  </v-sheet>
</template>

<script lang="ts">
  import {defineComponent, computed, getCurrentInstance} from 'vue';
  import { useDisplay, useLayout } from 'vuetify';

  export default defineComponent({
    transition: 'scroll-x-transition',
    // layout: 'landing',
    middleware(ctx) {
      //
    },
    setup() {
      const display = useDisplay();
      const layout = useLayout();
      console.log(layout.getLayoutItem('header'));

      const heightComputed = computed(() => {
        let result =`calc(100vh - ${display?.footer?.value || 104}px)`;
        const screenHeight = display.height.value || 0;
        if (screenHeight < 630) {
          result = '400';
        }
        return result;
      });
      return {
        heightComputed,
        display,
      };
    },
  })
</script>

<style lang="scss" scoped>
.v-sheet {
  text-shadow: grey 1px 0 10px;
}
</style>
