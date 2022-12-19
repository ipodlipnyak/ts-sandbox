<template>
  <div>
    <bl-json-to-csv-btn :value="usersList" :headers="headesToExport" class="mb-4" />
    <bl-csv-import
      :headers="headers"
      v-model="balance"
      :intersection-data="usersList"
      intersection-key="email"
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
    ctx.store.dispatch('admin/fetchAllUsers');
  },
  setup() {
    const snackbarShow = ref(false);
    const uploadError = ref('');
    const headers = computed(() => {
      const result = [
        'email',
        'delta',
        'firstName',
        'middleName',
        'lastName',
        'trackName',
      ];
      return result;
    });
    const headesToExport = computed(() => {
      const result = [
        ...headers.value,
        'total',
        'score',
        'lastDelta',
      ];
      return result;
    });
    const balance = ref(undefined);
    const { uploadBalance } = useActions('admin', ['uploadBalance']);
    const submit = async () => {
      uploadError.value = '';
      const succeded = await uploadBalance(balance.value);
      if (succeded) {
        snackbarShow.value = true;
      } else {
        uploadError.value = 'Что-то пошло не так';
      }
    }
    const { usersList } = useGetters('admin', ['usersList'])
    return {
      balance,
      submit,
      headers,
      headesToExport,
      usersList,
      snackbarShow,
      uploadError,
    }
  }
})
</script>
