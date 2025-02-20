<template>
  <v-card class="my-mc-status">
    <v-toolbar color="transparent">
      <template v-slot:prepend>
        <v-card-title>
          <span class="text-uppercase font-weight-bold">My telegram chats</span>
        </v-card-title>
      </template>
      <template v-slot:append>
        <v-btn @click="telegramUsersStore.fetchAll" :loading="telegramUsersStore.pending" icon="mdi-reload"
          variant="tonal" />
      </template>
    </v-toolbar>

    <v-card-item>
      <v-row>
        <v-col>
          <v-text-field label="Enter new chat token" v-model="telegramUsersStore.token"
            :disabled="telegramUsersStore.pending" @click:clear="telegramUsersStore.token = ''"
            clear-icon="mdi-close-circle" clearable>
            <template v-slot:prepend>
              <v-btn @click="telegramUsersStore.addNewChat"
                :disabled="(telegramUsersStore.pending || !telegramUsersStore.token)" icon="mdi-plus" variant="tonal" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-data-table-virtual :headers="headers" :items="telegramUsersStore.getAll" :loading="telegramUsersStore.pending"
        :fixed-header="true" height="400">
        <template v-slot:item.actions="{ item }">
          <v-btn @click="telegramUsersStore.deleteChat(item.id)" :disabled="telegramUsersStore.pending" icon="mdi-karate" color="red" size="small" class="my-4"
            variant="tonal" />
        </template>
      </v-data-table-virtual>
    </v-card-item>

  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useTelegramUsersStore } from '@/stores';

export default defineComponent({
  setup(props, ctx) {
    const route = useRoute();
    const router = useRouter();
    const telegramUsersStore = useTelegramUsersStore();
    telegramUsersStore.fetchAll();

    const token = route.query?.token as string;
    if (token) {
      // retrive token from url query
      telegramUsersStore.token = token;
      // clean this token from url by pushing on the same page without query
      router.push(route.path);
    }

    const headers = [
      {
        title: 'Chat ID',
        // title: 'Dessert (100g serving)',
        // align: 'start',
        // sortable: false,
        key: 'tgChatId',
      },
      {
        title: 'User ID',
        key: 'tgUserId',
      },
      {
        title: 'Username',
        key: 'username',
      },
      {
        title: 'Last Name',
        key: 'lastName',
      },
      { title: 'Delete', key: 'actions', sortable: false },
    ];


    return {
      telegramUsersStore,
      headers,
    }
  },
})
</script>
