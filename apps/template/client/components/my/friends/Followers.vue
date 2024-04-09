<template>
  <v-card color="amber" variant="tonal" :loading="myStore.followersPending">
    <v-toolbar>
      <v-toolbar-title>Followers</v-toolbar-title>
      <v-spacer />
      <v-btn @click="myStore.fetchMySubscriptions" :loading="myStore.followersPending" icon="mdi-refresh" variant="tonal"></v-btn>
    </v-toolbar>

    <v-virtual-scroll
      :items="myStore.followers"
      height="320"
      item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
          class="my-2"
          :title="[item.firstName, item.middleName, item.lastName].filter((el) => !!el).join(' ') || 'Anonimus'"
          :subtitle="`${item.email}`"
        >
          <template v-slot:prepend>
            <v-avatar icon="mdi-incognito" :image="item.pictureUrl" />
          </template>
          <template v-slot:append>
            <v-btn variant="tonal" color="green" icon="mdi-human-greeting-variant"></v-btn>
            <v-btn variant="tonal" color="red" icon="mdi-human-greeting-variant"></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useMyStore } from '~/stores';

export default defineComponent({
  setup(props, ctx) {
    const myStore = useMyStore();
    myStore.fetchMyFollowers();

    return {
      myStore,
    }
  },
})
</script>
