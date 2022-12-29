import { defineStore, acceptHMRUpdate } from 'pinia';
// import { AxiosError } from 'axios';
export const useAuthStore = defineStore('auth', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    whoami: null,
    errorMessage: '',
  }),
  actions: {
    async fetchUserData() {
      const {data, pending, error, refresh} = await useFetch('/api/auth/');
      if (data.value?.status === 'success') {
        this.whoami = data.value.payload;
      }
    },

    async login(login: string, password: string) {
      await useFetch('/api/auth/login', {method: 'post', body: {login, password}});
      await this.fetchUserData();
    },
    async logout() {
      await useFetch('/api/auth/logout', {method: 'post'});
      this.$reset();
    },
  },

  getters: {
    loggedIn: (state): boolean => !!state.whoami?.email,
    firstName: (state): string => state.whoami?.firstName || '',
    middleName: (state): string => state.whoami?.middleName || '',
    lastName: (state): string => state.whoami?.lastName || '',
    email: (state) => state.whoami?.whoami || '',
    fullName(): string {
      const fullName = [this.firstName, this.middleName, this.lastName].join(' ').trim();
      return fullName || this.email || '';
    },
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
