<template>
  <div>
    <alfa-title>qr</alfa-title>
    <v-container class="fill-height">
      <v-row class="mb-16" no-gutters justify="center">
        <span>Предъявите ваш уникальный QR-код для того чтобы получить байкоины</span>
      </v-row>
      <v-sheet height="300" width="100%" color="transparent">
      <v-row class="fill-height" justify="center" align="center">
        <canvas ref="canvas" />
      </v-row>
      </v-sheet>
    </v-container>
  </div>
</template>

<script lang="ts">
  /**
   * @see https://github.com/soldair/node-qrcode
   */
  import {defineComponent, ref, computed, reactive, watch, nextTick, onMounted, getCurrentInstance} from 'vue';
  import {useGetters, useActions, useState} from '@/plugins/vuex-helpers';
  import QRCode from 'qrcode';

  export default defineComponent({
    transition: 'fade-transition',
    scrollToTop: true,
    setup() {
      const {email} = useGetters('auth', ['email']);
      const canvas = ref(undefined);

      const generate = () => {
        QRCode.toCanvas(canvas.value, email.value, {width: 300}, (error: any) => {
          if (error) {
            // console.error(error)
          }
          // console.log('success!');
        })
      }

      onMounted(() => {
        generate();
      });

      watch(email, () => {
        generate();
      });

      return {
        email,
        canvas,
      }
    }
  })
</script>
