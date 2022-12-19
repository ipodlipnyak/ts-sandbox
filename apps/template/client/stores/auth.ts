import { defineStore, acceptHMRUpdate } from 'pinia';

const useAuth = defineStore('auth', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
  }),
  actions: {
    fetchUserData() {
      this.firstName = 'test';
      this.middleName = 'blah';
      this.lastName = 'test';
      this.email = 'test@test.test';
    },
  },

  getters: {
    fullName: (state) => {
      const fullName = [state?.firstName, state?.middleName, state?.lastName].join(' ').trim();
      return fullName || state.email || '';
    },
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot));
}
