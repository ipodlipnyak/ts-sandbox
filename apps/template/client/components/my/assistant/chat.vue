<template>
    <div>
        <v-container>
            <v-card>
                <v-list :items="assistantStore.historyFormatted" item-props lines="three" />
            </v-card>
        </v-container>

        <v-footer app height="72">
            <v-text-field
                :loading="assistantStore.pending"
                :disabled="assistantStore.pending"
                v-model="assistantStore.input"
                bg-color="grey-lighten-1"
                class="rounded-pill overflow-hidden"
                density="compact"
                hide-details
                variant="solo"
                clearable
                append-icon="mdi-send"
                @click:append="assistantStore.query"
                @keyup.enter="assistantStore.query"
            />
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

        return {
            assistantStore,
        }
    },
})
</script>
