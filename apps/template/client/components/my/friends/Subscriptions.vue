<template>
  <v-card color="blue" variant="tonal" :loading="myStore.subscriptionsPending">
    <v-toolbar>
      <v-toolbar-title>Subscriptions</v-toolbar-title>
      <v-spacer />
      <v-btn @click="myStore.fetchMySubscriptions" :loading="myStore.subscriptionsPending" icon="mdi-refresh" variant="tonal"></v-btn>
    </v-toolbar>

    <v-text-field class="ma-4" variant="solo-filled" label="Invite to be a friend">
      <template v-slot:append-inner>
        <v-btn variant="tonal" icon="mdi-paw"></v-btn>
      </template>
    </v-text-field>

    <v-virtual-scroll
      :items="myStore.subscriptions"
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
            <v-btn variant="tonal" color="red" icon="mdi-paw-off"></v-btn>
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
    myStore.fetchMySubscriptions();

    return {
      myStore,
    }
  },
})
</script>
