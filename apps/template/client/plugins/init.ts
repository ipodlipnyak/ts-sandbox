import { useGoogleStore, useAuthStore } from '~/stores';
// import {defineNuxtPlugin} from 'nuxt/dist/app/nuxt';
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:beforeMount', async () => {
      const authStore = useAuthStore();
      await authStore.fetchUserData();
      const googleStore = useGoogleStore();
      await googleStore.fetchAll();
    })
})
