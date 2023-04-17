<template>
    <GoogleLogin v-if="clientId" :callback="callback" prompt :clientId="clientId" />
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useGoogleStore } from '~/stores';

export default defineComponent({
    setup(props, ctx) {
        const googleStore = useGoogleStore();
        const { clientId, verifyJwt } = googleStore;
        const callback = (response: any) => {
            const credential = response?.credential;
            if (credential) {
                verifyJwt(credential); 
            }
        };

        return {
            clientId,
            callback,
        }
    },
})
</script>
