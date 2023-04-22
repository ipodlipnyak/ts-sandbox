import { defineStore, acceptHMRUpdate } from 'pinia';
import { useAuthStore } from './auth';
import { stat } from 'fs';

interface LLMResponse {
    response: string
}

enum LogItemType {
    input = 'input',
    output = 'output',
}

interface LogItem {
    timestamp: number
    text: string
    type: LogItemType 
}

export const useAssistantStore = defineStore('assistant', {
    state: () => ({
        input: '',
        lastResponse: null as LLMResponse | null,
        log: [] as LogItem[],
        pending: false,
    }),
    actions: {
        addToLog(text: string, type: LogItemType) {
            if (!text) {
                return
            }

            const timestamp = Date.now();
            this.log = [...this.log, {
                text,
                timestamp,
                type,
            }]
        },

        async query() {
            this.pending = true;
            this.addToLog(this.input, LogItemType.input)
            const { data, pending, error, refresh } = await useFetch('/api/llm/query', { method: 'post', body: { text: this.input } });
            if (data.value?.status === 'success') {
                this.lastResponse = data.value.payload;
                this.addToLog(this.lastResponse?.response || '', LogItemType.output)
                this.input = '';
            }
            this.pending = false;
        },
    },

    getters: {
        lastResponseText: (state): string => state.lastResponse?.response || '',
        history: (state): LogItem[] => state.log.sort((a,b) => {
            return a.timestamp - b.timestamp;
        }), 
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAssistantStore, import.meta.hot));
}
