import { defineStore, acceptHMRUpdate } from 'pinia';
import type { RestResponseDto } from '../../src/dto';
import { useAuthStore } from './auth';
import { UserNameDto } from './../../src/dto/user.dto';

/**
 * For personal space configuration
 */
export const useMyStore = defineStore('my', {
    // arrow function recommended for full type inference
    state: () => ({
        nameUpdatePending: false
    }),
    actions: {
        async updateName(name: UserNameDto) {
            this.nameUpdatePending = true;
            const authStore = useAuthStore();

            const { data, pending, error, refresh } = await useFetch('/api/my/name', {
                method: 'post',
                body: name,
            });
            const response = data.value as RestResponseDto;
            if (response?.status === 'success') {
                await authStore.fetchUserData();
            }

            this.nameUpdatePending = false;
        }
    },

    getters: {
        nameUpdatePendingGetter: (state): boolean => state.nameUpdatePending,
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot));

}
