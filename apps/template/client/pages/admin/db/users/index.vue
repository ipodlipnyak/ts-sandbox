<template>
  <div>
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
      :items="usersList"
      :items-per-page="10"
      :loading="usersListPending"
      :search="search"
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <v-row>
        <v-col align="end">
        <v-btn :to="`/admin/db/users/${item.id}`" nuxt block> Баланс </v-btn>
        </v-col>
        <v-col align="end">
        <v-btn :to="`/admin/db/users/${item.id}/purchases`" nuxt block> Покупки </v-btn>
        </v-col>
        <v-col align="end">
        <v-btn @click.stop="userToDeactivate = item" color="red" dark block>Деактивировать</v-btn>
        </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-if="userToDeactivate" max-width="600" v-model="confirmDeactivation">
    <v-card width="100%" class="pb-4">
    <v-card-title>
      Отключить пользователя?
    </v-card-title>
    <v-card-text class="text-body-1">
    <v-row no-gutters>
      <span>
        {{ userToDeactivate.email }}
      </span>
    </v-row>
    <v-row no-gutters>
      <span>
        {{ userToDeactivate.fullName }}
      </span>
    </v-row>
    </v-card-text>
    <v-card-actions>
    <v-row>
    <v-col>
    <v-btn @click.stop="deactivate" color="green" block dark>Подтвердить</v-btn>
    </v-col>
    <v-col>
    <v-btn @click.stop="confirmDeactivation = false" color="red" block dark>Закрыть</v-btn>
    </v-col>
    </v-row>
    </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
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
    ctx.store.dispatch('admin/fetchAllUsers')
  },

  setup(props, ctx) {
    const { fetchAllUsers, deactivateUser } = useActions('admin', ['fetchAllUsers', 'deactivateUser'])
    const { usersList } = useGetters('admin', ['usersList'])
    const { usersListPending } = useState('admin', ['usersListPending'])

    const userToDeactivate = ref(null);
    const confirmDeactivation = ref(false);
    watch(userToDeactivate, () => {
      confirmDeactivation.value = true;
    });
    const deactivate = async () => {
      const selectedUser: any = userToDeactivate?.value as any;
      const userId: number = selectedUser?.id as number;
      if (!userId) {
        return;
      }
      await deactivateUser(userId);
      confirmDeactivation.value = false;
    };

    onMounted(() => {
      // fetchAllUsers()
    })

    const search = ref('')

    const headers = ref([
      {
        text: 'Имя',
        align: 'start',
        // sortable: false,
        value: 'fullName',
      },
      {
        text: 'E-mail',
        // align: 'center',
        value: 'email',
      },
      {
        text: 'Трек',
        // align: 'center',
        value: 'trackName',
      },
      {
        text: 'Доступно байкоинов',
        // align: 'center',
        value: 'total',
      },
      {
        text: 'Рейтинг',
        // align: 'center',
        value: 'score',
      },
      {
        text: 'Активен',
        // align: 'center',
        value: 'active',
      },
      {
        text: '',
        align: 'end',
        value: 'actions',
      },
    ])

    return {
      fetchAllUsers,
      headers,
      usersList,
      usersListPending,
      search,
      deactivateUser,
      userToDeactivate,
      confirmDeactivation,
      deactivate,
    }
  },
})
</script>
