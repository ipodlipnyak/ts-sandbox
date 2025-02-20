import type { RestListResponseDto } from '../../../../libs/common/src/dto';
import { defineStore, acceptHMRUpdate } from 'pinia';

export const useTelegramUsersStore = defineStore('telegramUsers', {
    state: () => ({
        data: null as any,
        token: '',
        pending: false,
    }),

    actions: {
        async fetchAll() {
          this.pending = true;

          const { data } = await useFetch('/api/tg');
          const response = data.value as RestListResponseDto;
          if (response?.status === 'success') {
            this.data = response.payload || [];
          }

          this.pending = false;
        },

        async addNewChat() {
          this.pending = true;

          const { data } = await useFetch('/api/tg/', {
            method: 'post',
            body: {
              token: this.token,
            }
          });

          const response = data.value as RestListResponseDto;
          if (response?.status === 'success') {
            this.token = '';
            await this.fetchAll();
          }

          this.pending = false;
        },

        async deleteChat(id: string) {
          this.pending = true;

          const { data } = await useFetch(`/api/tg/${id}`, {
            method: 'delete',
          });

          const response = data.value as RestListResponseDto;
          if (response?.status === 'success') {
            await this.fetchAll();
          }

          this.pending = false;
        },
    },

    getters: {
        getAll: (state): any[] => state.data || [],
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTelegramUsersStore, import.meta.hot));
}
