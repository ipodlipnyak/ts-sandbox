<template>
  <v-list-item
    class="my-2"
    :title="name"
    :subtitle="email"
  >
    <template v-slot:prepend>
      <v-avatar icon="mdi-incognito" :image="picture" />
    </template>
    <template v-slot:append>
      <v-btn variant="tonal" color="red" icon="mdi-axe"></v-btn>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    name: String,
    email: String,
    picture: String,
  },

  setup(props, ctx) {

    return {
    }
  },
})
</script>
