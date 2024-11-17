import { useAuthStore } from '../../client/stores';
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  if (!authStore.isAdmin) {
    return false;
  }
})
