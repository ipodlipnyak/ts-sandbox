<template>
  <div>
    <bl-json-to-csv-btn :value="products" :headers="headers" class="mb-4" />
    <bl-csv-import
      :headers="headers"
      v-model="productsToUpload"
      :intersection-data="products"
      intersection-key="code"
    />
    <v-btn class="mt-4" color="green" @click="submit" dark block>Сохранить</v-btn class="mt-4">

    <v-snackbar v-model="snackbarShow" top :absolute="false" color="deep-purple accent-4">
      <span class="font-weight-bold">Успешно залито</span>
    </v-snackbar>

    <v-snackbar :value="!!uploadError" top absolute color="red">
      <span class="font-weight-bold">{{ uploadError }}</span>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useActions, useGetters } from '@/plugins/vuex-helpers'

export default defineComponent({
  middleware(ctx) {
    ctx.store.dispatch('products/fetchAllProducts');
  },

  setup() {
    const snackbarShow = ref(false);
    const uploadError = ref('');
    const headers = computed(() => {
      const result = [
        'code',
        'name',
        'price',
        'type',
        'active',
        // 'link',
        'secret',
        'image',
        'description',
        'countPurchases',
      ];
      return result;
    });
    const productsToUpload = ref(undefined);
    const { uploadProducts } = useActions('products', ['uploadProducts']);
    const submit = async () => {
      uploadError.value = '';
      const succeded = await uploadProducts(productsToUpload.value);
      if (succeded) {
        snackbarShow.value = true;
      } else {
        uploadError.value = 'Что-то пошло не так';
      }
    }

    const { products } = useGetters('products', ['products'])

    return {
      productsToUpload,
      submit,
      headers,
      products,
      snackbarShow,
      uploadError,
    }
  }
})
</script>
