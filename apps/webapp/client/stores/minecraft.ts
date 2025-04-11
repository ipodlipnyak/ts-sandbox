import { defineStore, acceptHMRUpdate } from 'pinia';
import type { MinecraftStatusDto, MinecraftStatusReponseDto } from '../../../../libs/common/src/dto';

export const useMinecraftStore = defineStore('minecraft', {
    state: () => ({
        mcStatus: {} as MinecraftStatusDto,
        mcStatusPending: false,
        mcOnOffPending: false,
        mcUserIp: '',
    }),

    actions: {
        async fetchStatus() {
            this.mcStatusPending = true;

            const url = '/api/minecraft';
            const fetchUrl = this.mcUserIpGetter ? `${url}/?ip=${this.mcUserIpGetter}` : url;

            const { data, pending, error, refresh } = await useFetch(fetchUrl);
            const response = data.value as MinecraftStatusReponseDto;
            if (response?.status === 'success') {
                this.mcStatus = response.payload;
            }

            this.mcStatusPending = false;
        },
        async startServer() {
            this.mcOnOffPending = true;

            const { data, pending, error, refresh } = await useFetch('/api/minecraft/start', {
                method: 'post',
                body: {
                  ip: this.mcUserIpGetter,
                }
            });
            const response = data.value as MinecraftStatusReponseDto;
            if (response?.status === 'success') {
                await this.fetchStatus();
            }

            this.mcOnOffPending = false;
        },
        async stopServer() {
            this.mcOnOffPending = true;

            const { data, pending, error, refresh } = await useFetch('/api/minecraft/stop', {
                method: 'post',
                body: {
                  ip: this.mcUserIpGetter,
                }
            });
            const response = data.value as MinecraftStatusReponseDto;
            if (response?.status === 'success') {
                await this.fetchStatus();
            }

            this.mcOnOffPending = false;
        },
        async switchOnOffServer() {
            if (this.isPending) {
                return;
            }

            if (!this.isPlayerHaveAccess) {
                await this.startServer();
                return;
            }

            if (this.isOnlineGetter) {
                await this.stopServer();
                return;
            }

            await this.startServer();
        }
    },

    getters: {
        mcIpRegexp: () => /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
        mcUserIpGetter(state): string {
          const isIp = this.mcIpRegexp.test(state.mcUserIp);
          if (isIp) {
            return state.mcUserIp
          }

          return state.mcStatus.userIp
        },
        mcStatusGetter: (state): string => state.mcStatus.status || "UNKNOWN",
        isOnlineGetter: (state): boolean => state.mcStatus.status === "RUNNING",
        mcIpGetter: (state): string => state.mcStatus.externalIp || "x.x.x.x",
        isPending: (state): boolean => state.mcStatusPending || state.mcOnOffPending,
        isPlayerHaveAccess: (state): boolean => state.mcStatus.isPlayerHaveAccess || false,
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMinecraftStore, import.meta.hot));
}
