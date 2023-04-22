<template>
    <div>
        <v-container>
            <v-list :items="items" item-props lines="three">
                <template v-slot:subtitle="{ subtitle }">
                    <div v-html="subtitle"></div>
                </template>
            </v-list>
        </v-container>

        <v-footer app height="72">
            <v-text-field bg-color="grey-lighten-1" class="rounded-pill overflow-hidden" density="compact" hide-details
                variant="solo"></v-text-field>
        </v-footer>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { useAssistantStore } from '~/stores/assistant';

export default defineComponent({
    setup(props, ctx) {
        const assistantStore = useAssistantStore();
        const { pending, lastResponseText, input, log } = assistantStore;
        // const items = log.map((logItem) => {
        //     return {
        //         title: logItem.type,
        //         subtitle: logItem.text,
        //     }
        // })
        const items = ref([]);
        watch(log, async (newValue, oldValue) => {
            const newItemsList: any[] = [
                { type: 'subheader', title: 'Today' },
            ];
            newValue.forEach((logItem) => {
                newItemsList.push({
                    title: logItem.type,
                    subtitle: logItem.text,
                });
                newItemsList.push({ type: 'divider', inset: true });
            });
        })

        return {
            items
        }
    },
})
</script>
