<template>
    <div>
        <v-container>
            <v-card v-for="(item, index) in assistantStore.history" :key="index"
                :color="item.type === 'input' ? 'green-darken-3' : 'blue-darken-2'" class="my-4">
                <v-card-title>
                    <v-icon :icon="item.type === 'input' ? 'mdi-emoticon-poop' : 'mdi-robot'" />
                    {{ item.type === 'input' ? 'You Handsome' : 'Happy Robot' }}
                </v-card-title>
                <v-card-subtitle>
                    {{ (new Date(item.timestamp)).toLocaleTimeString() }}
                </v-card-subtitle>
                <v-card-text>
                    {{ item.text }}
                </v-card-text>
            </v-card>
        </v-container>

        <v-dialog v-model="showFullText" fullscreen :scrim="false" transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar>
                    <v-spacer />
                    <v-btn fab @click.stop="showFullText = false"></v-btn>
                </v-toolbar>
            </v-card>
        </v-dialog>

        <v-footer app height="72">
            <v-text-field :loading="assistantStore.pending" :disabled="assistantStore.pending"
                v-model="assistantStore.input" bg-color="grey-lighten-1" class="rounded-pill overflow-hidden"
                density="compact" hide-details variant="solo" clearable append-icon="mdi-send"
                @click:append="assistantStore.query" @keyup.enter="assistantStore.query" />
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
        const showFullText = ref(false);
        const fullText = ref('');
        const selectMessage = (e: any) => {
            console.log(e);
        }

        return {
            selectMessage,
            fullText,
            showFullText,
            assistantStore,
        }
    },
})
</script>
