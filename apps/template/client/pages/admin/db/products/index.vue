<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="products"
      :items-per-page="10"
      :loading="productsPending"
      :search="search"
      class="elevation-1"
    />
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  reactive,
  watch,
  nextTick,
  onMounted,
} from 'vue'
import { useGetters, useActions, useState } from '@/plugins/vuex-helpers'

export default defineComponent({
  middleware(ctx) {
    ctx.store.dispatch('products/fetchAllProducts')
  },

  setup(props, ctx) {
    const { fetchAllProducts } = useActions('products', ['fetchAllProducts']);
    const { products } = useGetters('products', ['products']);
    const { productsPending } = useState('products', ['productsPending']);

    onMounted(() => {
      // fetchAllProducts()
    })

    const search = ref('')

    const headers = ref([
      {
        text: 'Артикул',
        // align: 'center',
        value: 'code',
      },
      {
        text: 'Имя',
        align: 'start',
        // sortable: false,
        value: 'name',
      },
      /*
      {
        text: 'Ссылка',
        // align: 'center',
        value: 'link',
      },
      */
      {
        text: 'Секрет',
        // align: 'center',
        value: 'secret',
      },
      {
        text: 'Описание',
        // align: 'center',
        value: 'description',
      },
      {
        text: 'Картинка',
        // align: 'center',
        value: 'image',
      },
      {
        text: 'Активный',
        // align: 'center',
        value: 'active',
      },
      {
        text: 'Покупок',
        value: 'countPurchases',
      },
      {
        text: 'Цена',
        // align: 'center',
        value: 'price',
      },
    ])

    return {
      headers,
      products,
      productsPending,
      search,
    }
  },
})
</script>
