<template>
    <GoogleLogin :callback="callback">
        <v-btn>Login Using Google</v-btn>
    </GoogleLogin>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';

export default defineComponent({
    setup(props, ctx) {
        const message = ref('This is a message')
        const messageComputed = computed(() => {
            return 'test'
        })
        const display = useDisplay();
        const layout = useLayout();
        const authStore = useAuthStore();
        const usersStore = useUsersStore();
        const callback = (response: any) => {
           console.log(response);
        };

        return {
            callback,
            message,
            messageComputed,
            display,
            layout,
        }
    },
})
</script>
