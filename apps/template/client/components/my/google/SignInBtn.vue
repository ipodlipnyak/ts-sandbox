<template>
    <v-theme-provider theme="light">
        <v-sheet color="transparent">
            <v-row no-gutters justify="center">
              <GoogleLogin
                v-if="clientId"
                :callback="callback"
                :prompt="false"
                :clientId="clientId"
              >
                <v-btn size="large" elevation="1" variant="flat" block color="#00074b" text="Login" prepend-icon="mdi-login">
                </v-btn>
              </GoogleLogin>
            </v-row>
        </v-sheet>
    </v-theme-provider>
</template>

<script lang="ts">
/**
 * @see https://www.npmjs.com/package/vue3-google-login
 * @see https://devbaji.github.io/vue3-google-login/
 */

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
