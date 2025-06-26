import { TelegramConfigDto, type RestListResponseDto, type TelegramConfigResponseDto, TelegramUserAuthoriseDto } from '../../../../libs/common/src/dto';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useAuthStore } from './auth';

export const useTelegramUsersStore = defineStore('telegramUsers', {
  state: () => ({
    data: null as any,
    token: '',
    pending: false,
    config: null as TelegramConfigDto | null
  }),

  actions: {
    async init() {
      const { data } = await useFetch('/api/tg/');
      const response = data.value as TelegramConfigResponseDto;
      if (response?.status === 'success') {
        this.config = response.payload;
      }
    },

    async auth(body: TelegramUserAuthoriseDto) {
      const authStore = useAuthStore();

      const { data } = await useFetch('/api/tg/auth', {
        method: 'post',
        body,
      });
      const response = data.value as TelegramConfigResponseDto;
      if (response?.status === 'success') {
          await authStore.fetchUserData();
          const router = useRouter();
          router.replace({ name: 'my' })
      }
    },

    async fetchAll() {
      this.pending = true;

      const { data } = await useFetch('/api/tg/chat');
      const response = data.value as RestListResponseDto;
      if (response?.status === 'success') {
        this.data = response.payload || [];
      }

      this.pending = false;
    },

    async addNewChat() {
      this.pending = true;

      const { data } = await useFetch('/api/tg/chat', {
        method: 'post',
        body: {
          token: this.token,
        }
      });

      const response = data.value as RestListResponseDto;
      if (response?.status === 'success') {
        await this.fetchAll();
        this.token = '';
      }

      this.pending = false;
    },

    async deleteChat(id: string) {
      this.pending = true;

      const { data } = await useFetch(`/api/tg/chat/${id}`, {
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
    botName: (state): string => state.config?.botName || '',
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTelegramUsersStore, import.meta.hot));
}
