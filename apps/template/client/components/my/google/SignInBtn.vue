<template>
    <v-theme-provider theme="light">
        <v-sheet color="transparent">
            <v-row no-gutters justify="center">
                <GoogleLogin v-if="clientId" :callback="callback" :prompt="false" :clientId="clientId" />
            </v-row>
        </v-sheet>
    </v-theme-provider>
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
