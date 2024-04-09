import { defineStore, acceptHMRUpdate } from 'pinia';
import { UserOutputDto, type RestResponseDto } from '../../src/dto';
import { useAuthStore } from './auth';
import { UserNameDto } from './../../src/dto/user.dto';

/**
 * For personal space configuration
 */
export const useMyStore = defineStore('my', {
    // arrow function recommended for full type inference
    state: () => ({
        whoamiPending: false,
        whoami: {} as UserOutputDto,
        nameUpdatePending: false
    }),
    actions: {
        async fetchMyFriends() {
            this.whoamiPending = true;

            const query = gql`{whoami{friends{email, firstName, middleName, lastName, pictureUrl}}}`;
            const {data} = await useAsyncQuery(query);
            const response = await data.value as any;
            this.whoami = {
                ...this.whoami,
                ...response.whoami
            }

            this.whoamiPending = false;
        },

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
        friends: (state) => state.whoami.friends,
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot));

}
