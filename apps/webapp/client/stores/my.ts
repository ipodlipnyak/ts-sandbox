import { defineStore, acceptHMRUpdate } from 'pinia';
import { useAuthStore } from './auth';
import { UserOutputDto, type RestResponseDto, UserNameDto } from '../../../../libs/common/src/dto';

/**
 * For personal space configuration
 */
export const useMyStore = defineStore('my', {
    // arrow function recommended for full type inference
    state: () => ({
        friendsPending: false,
        followersPending: false,
        subscriptionsPending: false,
        whoami: {} as UserOutputDto,
        nameUpdatePending: false
    }),
    actions: {
        async fetchMyFriends() {
            this.friendsPending = true;

            const query = gql`{whoamiUserOutputDto, type RestResponseDto {
              friends{email, firstName, middleName, lastName, pictureUrl}
            }}`;
            const {data} = await useAsyncQuery(query);
            const response = await data.value as any;
            this.whoami = {
                ...this.whoami,
                ...response.whoami
            }

            this.friendsPending = false;
        },

        async fetchMyFollowers() {
            this.followersPending = true;

            const query = gql`{whoami{
              followers{email, firstName, middleName, lastName, pictureUrl}
            }}`;
            const {data} = await useAsyncQuery(query);
            const response = await data.value as any;
            this.whoami = {
                ...this.whoami,
                ...response.whoami
            }

            this.followersPending = false;
        },

        async fetchMySubscriptions() {
            this.subscriptionsPending = true;

            const query = gql`{whoami{
              subscriptions{email, firstName, middleName, lastName, pictureUrl}
            }}`;
            const {data} = await useAsyncQuery(query);
            const response = await data.value as any;
            this.whoami = {
                ...this.whoami,
                ...response.whoami
            }

            this.subscriptionsPending = false;
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
        },
    },

    getters: {
        nameUpdatePendingGetter: (state): boolean => state.nameUpdatePending,
        friends: (state) => state.whoami?.friends || [],
        subscriptions: (state) => state.whoami?.subscriptions || [],
        followers: (state) => state.whoami?.followers || [],
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot));

}
