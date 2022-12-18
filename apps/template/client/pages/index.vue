<template>
  <v-sheet width="100%" class="fill-height" color="blue">
    <div>
      {{ height }}
      {{ heightComputed }}
    </div>
    <!--
    <v-img src="https://storage.yandexcloud.net/cg-twins-2022/baikal-forum/banner%20(1).jpg" :height="heightComputed">
    <v-row class="fill-height" no-gutters justify="center" align="center">
      <v-card color="transparent" width="600" flat>
        <v-card-title class="text-h3 text-uppercase mb-6 white--text">
          baikal shop
        </v-card-title>

        <v-card-subtitle class="mb-1 text-body-1 font-weight-medium white--text">
          Это интернет-магазин форума «Байкал». Здесь продаются сувениры от партнеров форума. Чтобы их купить, зарабатывай байкоины в течение работы на площадке и на форуме
        </v-card-subtitle>

        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :large="vuetify.breakpoint.smAndDown" :x-large="vuetify.breakpoint.mdAndUp" depressed to="/login"
                nuxt class="px-8" dark color="purple" block>
                Войти
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :large="vuetify.breakpoint.smAndDown" :x-large="vuetify.breakpoint.mdAndUp" depressed
                to="/signup" nuxt class="px-8" dark text block>
                Зарегистрироваться
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>
    </v-img>
    -->
  </v-sheet>
</template>

<script lang="ts">
  import {defineComponent, computed, getCurrentInstance} from 'vue';
  import { useDisplay } from 'vuetify';

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
      const { footer, height } = useDisplay();

      const heightComputed = computed(() => {
        let result =`calc(100vh - ${footer || 100}px)`;
        const screenHeight = height.value || 0;
        if (screenHeight < 630) {
          result = '400';
        }
        return result;
      });
      return {
        heightComputed,
        height,
      };
    },
  })
</script>

<style lang="scss" scoped>
.v-sheet {
  text-shadow: grey 1px 0 10px;
}
</style>
