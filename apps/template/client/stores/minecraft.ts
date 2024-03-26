import { defineStore, acceptHMRUpdate } from 'pinia';
import type { MinecraftStatusDto, MinecraftStatusReponseDto } from '../../src/dto';

export const useMinecraftStore = defineStore('minecraft', {
    state: () => ({
        mcStatus: {} as MinecraftStatusDto,
        mcStatusPending: false,
    }),

    actions: {
        async fetchStatus() {
            this.mcStatusPending = true;

            const { data, pending, error, refresh } = await useFetch('/api/minecraft/');
            const response = data.value as MinecraftStatusReponseDto;
            if (response?.status === 'success') {
                this.mcStatus = response.payload;
            }

            this.mcStatusPending = false;
        },
    },

    getters: {
        mcStatusGetter: (state): string => state.mcStatus.status || "UNKNOWN", 
        isOnlineGetter: (state): boolean => state.mcStatus.status === "RUNNING",
        mcIpGetter: (state): string => state.mcStatus.externalIp || "x.x.x.x",
        isPending: (state): boolean => state.mcStatusPending,
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMinecraftStore, import.meta.hot));
}
