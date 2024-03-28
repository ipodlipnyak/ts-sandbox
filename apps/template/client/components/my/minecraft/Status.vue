<template>
  <v-card
    height="200"
    max-width="400"
    class="my-mc-status"
    image="https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"
  >
    <v-toolbar color="transparent">
      <template v-slot:prepend>
        <v-card-title>
          <span class="text-uppercase font-weight-bold">Minecraft</span>
        </v-card-title>
      </template>
      <template v-slot:append>
        <v-fab-transition>
          <v-icon
            v-if="mcStore.isOnlineGetter"
            class="my-mc-status__icon"
            color="success"
            icon="mdi-minecraft"
            size="40"
          ></v-icon>

          <v-icon
            v-if="!mcStore.isOnlineGetter"
            class="my-mc-status__icon"
            color="red"
            icon="mdi-power-plug-off"
            size="40"
          ></v-icon>
        </v-fab-transition>
      </template>
    </v-toolbar>

    <v-card-item>
     <v-chip
      color="white"
      class="mt-4"
      size="large"
      variant="flat"      
      elevation="2"
      prepend-icon="mdi-content-copy"
      @click="copyToClipboard(mcStore.mcIpGetter)"
     >
      {{ mcStore.mcIpGetter }}
     </v-chip> 
    </v-card-item>
    
    <v-card-actions>
      <v-switch
        class="ml-2"
        color="green"
        inset
        hide-details
        :loading="mcStore.isPending"
        @update:model-value="mcStore.switchOnOffServer"
        :indeterminate="switchIndeterminate"
        :disabled="mcStore.isPending"
        :model-value="switchValue"
      ></v-switch>

      <v-spacer></v-spacer>

      <v-btn
        :loading="mcStore.isPending"
        density="compact"
        size="large"
        icon="mdi-refresh"
        variant="elevated"
        elevation="2"
        color="grey-darken-4"
        @click="mcStore.fetchStatus"
      ></v-btn>
    </v-card-actions>

  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useMinecraftStore } from '@/stores/minecraft';

export default defineComponent({
  setup(props, ctx) {
    const mcStore = useMinecraftStore();
    mcStore.fetchStatus();
    const copyToClipboard = (textToCopy: string) => {
      navigator.clipboard.writeText(textToCopy);
    }

    const switchValue = ref(false);
    const switchIndeterminate = ref(true);
    watch(
      () => mcStore.mcStatus,
      () => {
        switchValue.value = mcStore.isOnlineGetter;
        switchIndeterminate.value = false;
      }
    );

    return {
      copyToClipboard,
      mcStore,
      switchValue,
      switchIndeterminate,
    }
  },
})
</script>

<style lang="scss" scoped>
  .my-mc-status {
    :deep(img.v-img__img--cover) {
      // filter: blur(3.5px);
    }
    :deep(.v-toolbar__content) {
      backdrop-filter: blur(10px);
    }
    span {
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    }
    &__icon {
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    }
  }
</style>