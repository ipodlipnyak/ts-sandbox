import { useAuthStore } from '../../client/stores';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
// import {defineNuxtRouteMiddleware, navigateTo} from 'nuxt/dist/app/composables/router';
// import {defineNuxtRouteMiddleware} from '#imports';
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.fetchUserData();

  const { loggedIn } = authStore;
  const LOGIN_PATH_NAME = 'login';
  const LANDING_PATH_NAME = 'index';
  const SIGNUP_PATH_NAME = 'signup';
  const MY_PATH_NAME = 'my';
  const route = useRoute();

  const onLoginPage = to.name === LOGIN_PATH_NAME;
  const onSignUpPage = to.name === SIGNUP_PATH_NAME;
  const onLandingPage = to.name === LANDING_PATH_NAME;
  const onMyPage = to.name === MY_PATH_NAME;

  if (loggedIn && (onLoginPage || onSignUpPage || onLandingPage)) {
    try {
      return navigateTo({ name: MY_PATH_NAME });
    } catch (e) {
      //
    }
  }

  if (!loggedIn && !onLoginPage && !onLandingPage && !onSignUpPage) {
    try {
      return navigateTo({ name: LANDING_PATH_NAME });
    } catch (e) {
      //
    }
  }
})
