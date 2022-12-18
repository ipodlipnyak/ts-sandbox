import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi', // This is already the default value - only for display purposes
    },
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
  return {
    provide: {
      vuetify, // nope, not working
    },
  };
});
