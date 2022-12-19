<template>
  <v-container>
    <v-card>
    <v-tabs fixed-tabs class="mb-4 mt-n3">
      <v-tab to="/admin/db/users/" exact nuxt>Пользователи</v-tab>
      <!--
      <v-tab to="/admin/db/products/" nuxt>Продукты</v-tab>
      -->
      <v-tab to="/admin/db/events/" nuxt>События</v-tab>
    </v-tabs>
    </v-card>
    <nuxt-child />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  //
})
</script>
