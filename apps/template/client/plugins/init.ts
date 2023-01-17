import {useAuthStore} from '@/stores/auth';
// import {defineNuxtPlugin} from 'nuxt/dist/app/nuxt';
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:beforeMount', async () => {
      const authStore = useAuthStore();
      await authStore.fetchUserData();
    })
})
