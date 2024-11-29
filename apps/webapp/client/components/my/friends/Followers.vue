<template>
  <v-card color="amber" variant="tonal" :loading="myStore.followersPending">
    <v-toolbar>
      <v-toolbar-title>Followers</v-toolbar-title>
      <v-spacer />
      <v-btn @click="myStore.fetchMyFollowers" :loading="myStore.followersPending" icon="mdi-refresh" variant="tonal"></v-btn>
    </v-toolbar>

    <v-virtual-scroll
      :items="myStore.followers"
      height="320"
      item-height="48"
    >
      <template v-slot:default="{ item }">
        <my-friends-followers-item
          :name="[item.firstName, item.middleName, item.lastName].filter((el) => !!el).join(' ') || 'Anonimus'"
          :email="item.email"
          :picture="item.pictureUrl"
        />
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
