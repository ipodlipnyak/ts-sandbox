<template>
  <v-sheet
    width="100%"
    class="fill-height"
    color="blue"
  >
    <!--
    <v-img src="https://i.imgur.com/2wD3VJA.jpg" :height="heightComputed" cover>
    </v-img>
    -->
    <v-parallax
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    >

      <v-row no-gutters justify="center" align="center">
        <v-card color="transparent" width="600" flat height="100vh">
          <v-card-title class="text-h3 text-uppercase mb-6 white--text">
            blah blah
          </v-card-title>

          <v-card-subtitle class="mb-1 text-body-1 font-weight-medium white--text">
            Eveniet culpa consequuntur natus sapiente numquam aut et ab
          </v-card-subtitle>

          <v-card-actions>
            <v-row>

              <!--
              <v-col>
                <v-btn :size="display.smAndDown ? 'large' : 'x-large'" depressed to="/login" nuxt class="px-8" dark
                  color="green" block>
                  Войти
                </v-btn>
              </v-col>
              -->

              <v-col>
                <!--
                <v-btn :large="display.smAndDown" :x-large="display.mdAndUp" depressed
                  to="/signup" nuxt class="px-8" color="orange" dark block>
                  Зарегистрироваться
                </v-btn>
                -->
                <my-google-sign-in-btn />
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-parallax>

    <v-row align="center" justify="center" no-gutters>
      <v-col>
        <v-card
          :rounded="0"
          class="amoeba-wrapper overflow-hidden"
          v-intersect="onAmoebaIntersection"
          height="100vh"
          v-scroll="onScroll"
        >
          <v-sheet
            min-width="24px"
            ref="amoeba"
            rounded="pill"
            color="white"
            class="amoeba"
            height="80vh"
            :style="amoebaStyle"
          >

          </v-sheet>

        </v-card>

      </v-col>

    </v-row>

  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '~/stores';

export default defineComponent({
  middleware(ctx) {
    //
  },
  setup() {
    definePageMeta({
      // layout: 'landing',
      pageTransition: {
        name: 'scroll-x-transition',
      },
      layoutTransition: {
        name: 'scroll-x-transition',
      },
      middleware: [
        'auth',
      ],
      // middleware(ctx) {
      //   const authStore = useAuthStore();
      //   if (authStore.loggedIn) {
      //     navigateTo('/my');
      //   }
      // }
    });
    const display = useDisplay();
    const layout = useLayout();

    const heightComputed = computed(() => {
      // let result = `calc(100vh - ${display?.footer?.value || 104}px)`;
      let result = `calc(100vh)`
      const screenHeight = display.height.value || 0;
      if (screenHeight < 630) {
        result = '400';
      }
      return result;
    });

    const amoeba = ref(null);
    const amoebaIntersectionValue = ref(0);

    const amoebaStyle = computed(() => {
      // const df = amoebaIntersectionValue.value < display.width.value ? amoebaIntersectionValue.value : display.width.value;
      const iv = amoebaIntersectionValue.value;
      const dw = display.width.value / 2;
      const df = dw > iv ? dw - iv : 20;
      // const df = dw - iv;

      return {
        left: `calc(50% - ${df}px)`,
        right: `calc(50% - ${df}px)`
      };
    });

    const isAmoebaIntersected = ref(false);
    const onAmoebaIntersection = (
      isIntersecting: boolean,
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      isAmoebaIntersected.value = isIntersecting;
      const [entry] = entries;
      if (entry) {
        // amoebaIntersectionValue.value = entry.target.getBoundingClientRect().y;
        // console.log(entry.target.getBoundingClientRect());
      }
    };

    const onScroll = (scrollEvent: any) => {
      if (isAmoebaIntersected.value) {
        // const target = toRaw(amoeba.value);
        const target = amoeba.value as any;
        const rect = target?.$el.getBoundingClientRect();
        const { x, y, top, bottom } = rect;
        const { scrollTop } = scrollEvent.target;
        // console.log(scrollEvent.target);
        amoebaIntersectionValue.value = y;
      }
    };

    return {
      heightComputed,
      display,
      amoeba,
      amoebaStyle,
      isAmoebaIntersected,
      onAmoebaIntersection,
      onScroll,
    };
  },
})
</script>

<style lang="scss" scoped>
.v-sheet {
  text-shadow: grey 1px 0 10px;
}
.amoeba-wrapper {
  overflow: hidden;
}
.amoeba {
  // aspect-ratio: 1 / 2;
  top: 70px;
  position: absolute;
}
</style>
