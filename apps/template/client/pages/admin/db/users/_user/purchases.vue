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
      :items="purchases"
      :items-per-page="10"
      :loading="purchasesPending"
      :search="search"
      class="elevation-1"
    />
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useGetters, useActions, useState } from '@/plugins/vuex-helpers';

export default defineComponent({
  middleware(ctx) {
    ctx.store.dispatch('admin/fetchUserPurchases', ctx.route.params.user);
  },
  setup(props, ctx) {
    const { fetchUserPurchases } = useActions('admin', ['fetchUserPurchases']);
    const { purchases } = useGetters('admin', ['purchases']);
    const { purchasesPending } = useState('admin', ['purchasesPending']);

    const search = ref('');

    const headers = ref([
      {
        text: 'Стоимость',
        // align: 'start',
        // sortable: false,
        value: 'total',
      },
      {
        text: 'ID транзакции',
        // align: 'center',
        value: 'transactionId',
      },
      {
        text: 'Дата',
        // align: 'center',
        value: 'created',
      },
      {
        text: 'Продукт',
        // align: 'center',
        value: 'productName',
      },
      {
        text: 'Акртикул',
        // align: 'center',
        value: 'productCode',
      },
    ]);

    return {
      headers,
      purchases,
      fetchUserPurchases,
      purchasesPending,
      search,
    };
  },
})
</script>