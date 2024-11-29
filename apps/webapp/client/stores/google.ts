import { defineStore, acceptHMRUpdate } from 'pinia';
import { useAuthStore } from './auth';
import type { GoogleInitDto, GoogleInitReponseDto, RestResponseDto } from '../../src/dto';

export const useGoogleStore = defineStore('google', {
    // arrow function recommended for full type inference
    state: () => ({
        data: null as GoogleInitDto | null,
    }),
    actions: {
        async fetchAll() {
            const { data, pending, error, refresh } = await useFetch('/api/google/');
            const response = data.value as GoogleInitReponseDto;
            if (response?.status === 'success') {
                this.data = response.payload;
            }
        },

        async verifyJwt(credential: string) {
            const authStore = useAuthStore();
            const { data, pending, error, refresh } = await useFetch('/api/google/jwt', { method: 'post', body: { credential } });
            const response = data.value as RestResponseDto;

            if (response?.status === 'success') {
                await authStore.fetchUserData();
                const router = useRouter();
                router.replace({ name: 'my' })
                // this.data = data.value.payload;
            }
        },

        async verifyAccessToken(accessToken: string) {
            const authStore = useAuthStore();
            const { data, pending, error, refresh } = await useFetch('/api/google/token', { method: 'post', body: { accessToken } });
            const response = data.value as RestResponseDto;

            if (response?.status === 'success') {
                await authStore.fetchUserData();
                const router = useRouter();
                router.replace({ name: 'my' })
                // this.data = data.value.payload;
            }
        }
    },

    getters: {
        clientId: (state): string => state.data?.clientId || '',
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGoogleStore, import.meta.hot));
}
