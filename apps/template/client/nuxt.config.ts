import { defineNuxtConfig } from 'nuxt/config';
import vuetify from 'vite-plugin-vuetify';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static', // default is 'server'
  ssr: false,
  nitro: {
    devProxy: {
      '/api': 'http://127.0.0.1:3000/api',
    }
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          target: 'http://127.0.0.1:3000'
        },
      }
      // origin: 'http://127.0.0.1:3000/api',
      // port: 4000, // default: 3000
      // host: '0.0.0.0', // default: localhost,
      // timing: false
    },
  },
  /*
  proxy: {
    '/api': 'http://127.0.0.1:3000',
  },
  devServer: {
    port: 3000,
  },
  */
  modules: [
    '@pinia/nuxt',
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => config.plugins.push(vuetify()));
    },
  ],
  /*
  css: ['vuetify/styles'], // vuetify ships precompiled css, no need to import sass
  vite: {
    // curently this will lead to a type error, but hopefully will be fixed soon #justBetaThings
    ssr: {
      noExternal: ['vuetify'], // add the vuetify vite plugin
    },
  },
  modules: [
    // this adds the vuetify vite plugin
    // also produces type errors in the current beta release
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => config.plugins.push(vuetify()));
    },
  ],
  */
});
