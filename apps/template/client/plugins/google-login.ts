import vue3GoogleLogin from 'vue3-google-login';

/**
 * @see https://yobaji.github.io/vue3-google-login/
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    buttonConfig: {
      theme: 'filled_blue',
      shape: 'circle',
      size: 'large',
    },
  })
});
