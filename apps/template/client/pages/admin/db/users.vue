<template>
  <div>
    <v-card>
      <v-tabs fixed-tabs class="mb-4">
        <v-tab to="/admin/db/users" exact nuxt>Список</v-tab>
        <v-tab to="/admin/db/users/import" exact nuxt>Импорт/экспорт</v-tab>
      </v-tabs>
    </v-card>
    <nuxt-child />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue'

  export default defineComponent({
    //
  })
</script>