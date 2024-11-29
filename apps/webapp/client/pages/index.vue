<template>
  <v-sheet color="transparent" width="100vw" height="100vh" class="d-flex align-center justify-center">
    <v-card width="208" color="sand" class="pa-1">
      <v-row align="center">
        <v-col>
          <MyGoogleSignInBtn />
        </v-col>

        <v-col>
          <v-btn
            color="green-darken-3"
            block
            icon="mdi-home"
            :to="isHomePathExternal ? undefined : homePath"
            :href="isHomePathExternal ? homePath : undefined"
          ></v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
// import { useDisplay, useLayout } from 'vuetify';

export default defineComponent({
  middleware() {
    //
  },
  setup() {
    const defaultHomePath = '/';
    const mySub = 'my';

    const homePath = computed(() => {
      let result = defaultHomePath;

      if (isMySub.value) {
        const hostname = useRequestURL().hostname;
        const toHost = hostname.slice(`${mySub}.`.length);
        result = `https://${toHost}`;
      }

      return result;
    });

    const isMySub = computed(() => {
      const hostname = useRequestURL().hostname;
      return hostname.startsWith(`${mySub}.`);
    });

    const isHomePathExternal = computed(() => {
      return isMySub.value;
    })

    return {
      homePath,
      isHomePathExternal
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
