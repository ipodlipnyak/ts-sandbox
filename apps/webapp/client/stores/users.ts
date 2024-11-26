import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUsersStore = defineStore('friends', {
    // arrow function recommended for full type inference
    state: () => ({
        data: null as any,
    }),
    actions: {
        async fetchAll() {
            // const query = gql`
            // query getUsers($limit: Int!) {
            //     users {
            //       id
            //       email
            //     }
            //   }
            // `
            // const variables = { limit: 5 }
            // const { data } = await useAsyncQuery(query, variables)
            const query = gql`{users(role: 200){id,email}}`;
            const {data} = await useAsyncQuery(query);
            this.data = await data.value as any;
            //this.users = data;
        }
    },

    getters: {
        allUsers: (state): any[] => state.data?.users || [],
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
