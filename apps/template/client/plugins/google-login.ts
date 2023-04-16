import vue3GoogleLogin from 'vue3-google-login';

/**
 * @see https://yobaji.github.io/vue3-google-login/
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId: '253699887166-e9g9at2sknsn4rmv4e6lqt3igpcjbuel.apps.googleusercontent.com',
    buttonConfig: {
      theme: 'filled_blue',
      shape: 'circle',
      size: 'large',
    },
  })
});
