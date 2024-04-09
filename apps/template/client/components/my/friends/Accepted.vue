<template>
  <v-card color="green" variant="tonal" :loading="myStore.friendsPending">
    <v-toolbar>
      <v-toolbar-title>My pals</v-toolbar-title>
      <v-spacer />
      <v-btn @click="myStore.fetchMySubscriptions" :loading="myStore.friendsPending" icon="mdi-refresh" variant="tonal"></v-btn>
    </v-toolbar>

    <v-text-field class="ma-4" variant="solo-filled" label="Make a friend">
      <template v-slot:append-inner>
        <v-btn variant="tonal" icon="mdi-human-baby-changing-table"></v-btn>
      </template>
    </v-text-field>

    <v-virtual-scroll
      :items="myStore.friends"
      height="400"
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
            <v-btn variant="tonal" color="red" icon="mdi-dance-pole"></v-btn>
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
    myStore.fetchMyFriends();

    return {
      myStore,
    }
  },
})
</script>
