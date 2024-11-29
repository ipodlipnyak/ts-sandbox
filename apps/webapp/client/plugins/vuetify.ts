import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { md3 } from 'vuetify/blueprints';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    blueprint: md3,
    components,
    directives,
    /*
    icons: {
      defaultSet: 'mdi', // This is already the default value - only for display purposes
    },
    */
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            sea: '#00074b',
            sand: '#c5975c',
          },
        },
        light: {
          colors: {
            sea: '#00074b',
            sand: '#c5975c',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
  return {
    provide: {
      vuetify,
    },
  };
});
