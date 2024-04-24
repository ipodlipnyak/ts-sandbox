<template>
  <div>
    <!--
    <v-img src="https://i.imgur.com/2wD3VJA.jpg" :height="heightComputed" cover>
    </v-img>
    <v-parallax
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    >
    -->
    <v-parallax
      scale="0.2"
      src="/sea.svg"
    >
    <v-parallax
      scale="0.7"
      src="/fish.svg"
    >

    <v-sheet
      color="transparent"
      height="calc(100vh - 64px)"
    >
    <v-container class="fill-height">
      <v-row class="fill-height pb-8" align="end">
        <v-col cols="12">
          <v-row no-gutters justify="end">
            <my-youtube-iframe />
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            variant="tonal"
            color="#c5975cff"
            elevation="4"
            class="call-us mb-12"
            width="100%"
          >
            <v-card-title>Ut repellat amet incidunt.</v-card-title>
            <v-card-actions>
              <v-text-field
                prepend-inner-icon="mdi-email"
                label="E-mail"
                variant="solo"
                rounded="xl"
              >
              <template v-slot:append-inner>
                <v-btn rounded="xl" variant="tonal" color="green">
                  Join us
                </v-btn>
              </template>
              </v-text-field>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>


    </v-container>

    </v-sheet>
    </v-parallax>
    </v-parallax>


    <v-row align="center" justify="center" no-gutters>
      <v-col>
        <v-card
          color="#c5975cff"
          :rounded="0"
          class="amoeba-wrapper overflow-hidden"
          v-intersect="onAmoebaIntersection"
          height="calc(100vh - 64px)"
          v-scroll="onScroll"
        >

          <v-row class="fill-height py-12" no-gutters align="center" justify="center">
            <v-fade-transition hide-on-leave>
              <v-card
                v-if="amoebaIntersectionValue < amoebaContentTreshold"
                class="v-col-6 mt-12"
                height="600"
                color="transparent"
                variant="flat"
              >
                <v-row no-gutters justify="center">
                  <h1 class="text-black">
                    Blah blag
                  </h1>
                </v-row>

                <v-row no-gutters justify="center">
                    <v-chip color="green">{{ amoebaIntersectionValue }}</v-chip>
                </v-row>
                <v-fade-transition>

                  <v-row v-if="amoebaIntersectionValue < 150">
                    <v-col cols="12" md="4">
                      <v-chip color="green">{{ amoebaIntersectionValue }}</v-chip>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-chip color="red">Blah blah blah</v-chip>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-chip color="blue">Blah blah blah</v-chip>
                    </v-col>

                    <v-col>
                      <v-sheet color="transparent" height="300">
                        <v-row class="fill-height" align="end">
                          <v-col cols="12">
                            <v-row no-gutters justify="center">
                              <v-img src="/logo.svg" height="200"></v-img>
                            </v-row>
                          </v-col>
                          <v-col cols="12">
                            <v-row no-gutters justify="center">
                            <v-btn
                              v-for="media in socialMedia"
                              :key="media.name"
                              :href="media.link"
                              :icon="media.icon"
                              variant="text"
                              class="mx-1"
                            ></v-btn>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-sheet>
                    </v-col>
                  </v-row>

                </v-fade-transition>
              </v-card>
            </v-fade-transition>
          </v-row>

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

  </div>
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
    const amoebaContentTreshold = computed(() => {
      return display.mdAndUp.value ? 650 : 350;
    });

    const amoebaStyle = computed(() => {
      // const df = amoebaIntersectionValue.value < display.width.value ? amoebaIntersectionValue.value : display.width.value;
      const iv = amoebaIntersectionValue.value;
      const base = display.mdAndUp.value ? 2.4 : 0.7;
      const dw = display.width.value / base;
      const thr = 40; // threshold
      const df = dw - thr > iv ? dw - iv : thr;
      console.log(`${dw} - ${iv} = ${df}`)
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

    const socialMedia = [
      {
        name: 'youtube',
        icon: 'mdi-youtube',
        link: '#',
      },
      {
        name: 'instagram',
        icon: 'mdi-instagram',
        link: '#',
      },
      {
        name: 'whatsapp',
        icon: 'mdi-whatsapp',
        link: '#',
      },
      {
        name: 'facebook',
        icon: 'mdi-facebook',
        link: '#',
      },
    ];

    return {
      heightComputed,
      display,
      amoeba,
      amoebaStyle,
      isAmoebaIntersected,
      onAmoebaIntersection,
      onScroll,
      amoebaIntersectionValue,
      amoebaContentTreshold,
      socialMedia,
    };
  },
})
</script>

<style lang="scss" scoped>
.call-us {
  backdrop-filter: blur(30px);
}
.v-sheet {
  text-shadow: grey 1px 0 10px;
}
.amoeba-wrapper {
  overflow: hidden;
}
.amoeba {
  z-index: -1;
  // aspect-ratio: 1 / 2;
  top: 80px;
  position: absolute;
}
</style>
