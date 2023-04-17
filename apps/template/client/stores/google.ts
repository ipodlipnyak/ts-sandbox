import { defineStore, acceptHMRUpdate } from 'pinia';
import { useAuthStore } from './auth';

export const useGoogleStore = defineStore('google', {
    // arrow function recommended for full type inference
    state: () => ({
        data: null as any,
    }),
    actions: {
        async fetchAll() {
            const { data, pending, error, refresh } = await useFetch('/api/google/');
            if (data.value?.status === 'success') {
                this.data = data.value.payload;
            }
        },

        async verifyJwt(credential: string) {
            const authStore = useAuthStore();
            const { data, pending, error, refresh } = await useFetch('/api/google/jwt', { method: 'post', body: { credential } });

            if (data.value?.status === 'success') {
                await authStore.fetchUserData();
                // this.data = data.value.payload;
            }
        },
    },

    getters: {
        clientId: (state): any[] => state.data?.clientId || [],
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGoogleStore, import.meta.hot));
}
