import { defineStore, acceptHMRUpdate } from 'pinia';
// import { AxiosError } from 'axios';

export const useAuthStore = defineStore('auth', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    whoami: null,
  }),
  actions: {
    fetchUserData() {
      this.whoami = {
        firstName: 'test',
        middleName: 'blah',
        lastName: 'test',
        email: 'test@test.test',
      };
    },

    login(username: string, password: string) {
      this.fetchUserData();
      console.log(username + password);
    },
    logout() {
      this.$reset();
    },
  },

  getters: {
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
