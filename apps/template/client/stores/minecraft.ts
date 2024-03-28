import { defineStore, acceptHMRUpdate } from 'pinia';
import type { MinecraftStatusDto, MinecraftStatusReponseDto } from '../../src/dto';

export const useMinecraftStore = defineStore('minecraft', {
    state: () => ({
        mcStatus: {} as MinecraftStatusDto,
        mcStatusPending: false,
        mcOnOffPending: false,
    }),

    actions: {
        async fetchStatus() {
            this.mcStatusPending = true;

            const { data, pending, error, refresh } = await useFetch('/api/minecraft');
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
