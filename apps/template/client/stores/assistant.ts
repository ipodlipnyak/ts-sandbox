import { defineStore, acceptHMRUpdate } from 'pinia';
import { useAuthStore } from './auth';
import { stat } from 'fs';

interface LLMResponse {
    response: string
}

export const useAssistantStore = defineStore('assistant', {
    state: () => ({
        input: '',
        lastResponse: null as LLMResponse | null,
        inputLog: [] as string[],
        outputLog: [] as string[],
        pending: false,
    }),
    actions: {
        async query() {
            this.pending = true;
            const { data, pending, error, refresh } = await useFetch('/api/llm/query', { method: 'post', body: { text: this.input } });
            if (data.value?.status === 'success') {
                this.lastResponse = data.value.payload;
                this.inputLog = [...this.inputLog, this.input];
                this.outputLog = [...this.outputLog, this.lastResponse.response]; 
                this.input = '';
            }
            this.pending = false;
        },
    },

    getters: {
        lastResponseText: (state): string => state.lastResponse?.response || '',
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAssistantStore, import.meta.hot));
}
