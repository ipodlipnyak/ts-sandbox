import { defineStore, acceptHMRUpdate } from 'pinia';
import type { RestResponseDto, WhoAmIDto } from '../../src/dto';
// import { AxiosError } from 'axios';

export const useAuthStore = defineStore('auth', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    whoami: null as WhoAmIDto | null,
    errorMessage: '',
  }),
  actions: {
    async fetchUserData() {
      const { data, pending, error, refresh } = await useFetch('/api/auth/');
      const response = data.value as RestResponseDto;
      if (response?.status === 'success') {
        this.whoami = response.payload as WhoAmIDto;
      }
    },

    async login(login: string, password: string) {
      await useFetch('/api/auth/login', { method: 'post', body: { login, password } });
      await this.fetchUserData();
      const router = useRouter();
      router.replace({ name: 'my' })
    },

    async logout() {
      await useFetch('/api/auth/logout', { method: 'post' });
      this.$reset();

      const hostname = useRequestURL().hostname;
      const mySub = 'my';
      const isMySub = hostname.startsWith(`${mySub}.`);

      if (isMySub) {
        const toHost = hostname.slice(`${mySub}.`.length);
        await navigateTo(`https://${toHost}`, {
          external: true
        });
        return;
      }

      const router = useRouter();
      router.replace({ name: 'index' })
    },
  },

  getters: {
    loggedIn: (state): boolean => !!state.whoami?.email,
    firstName: (state): string => state.whoami?.firstName || '',
    middleName: (state): string => state.whoami?.middleName || '',
    lastName: (state): string => state.whoami?.lastName || '',
    email: (state) => state.whoami?.email || '',
    fullName(): string {
      const fullName = [this.firstName, this.middleName, this.lastName].join(' ').trim();
      return fullName || this.email || '';
    },
    isAdmin: (state): boolean => (state.whoami?.role || 100) >= 200,
    picture: (state): string => state.whoami?.pictureUrl || '',
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
