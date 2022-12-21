<template>
  <v-row class="fill-height" justify="center" align="center" no-gutters>
    <v-card v-show="inited" class="qr-wrapper fill-height" rounded="false" flat>
      <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
        <v-card color="transparent" flat class="pa-8">
          <v-row>
            <v-col align="start">
              <v-btn @click="switchCamera" icon color="red" large>
                <v-fab-transition>
                  <v-icon :key="cameraIcon">{{ cameraIcon }}</v-icon>
                </v-fab-transition>
              </v-btn>
            </v-col>
            <v-col align="end">
              <v-select v-model="score" :items="scoresList" label="Solo field" solo />
            </v-col>
          </v-row>
          <v-row class="fill-height">
            <v-progress-circular v-if="!inited" indeterminate color="primary"></v-progress-circular>
          </v-row>
        </v-card>
      </qrcode-stream>
    </v-card>

    <v-progress-circular v-if="!inited" indeterminate color="primary"></v-progress-circular>

    <v-snackbar v-model="snackbarShow" top absolute color="deep-purple accent-4">
      <v-icon class="mr-2">mdi-kangaroo</v-icon><span class="font-weight-bold">{{ snackbarMessage }}</span>
    </v-snackbar>

    <v-snackbar :value="!!addScoreError" top absolute color="red">
      <span class="font-weight-bold">{{ addScoreError }}</span>
    </v-snackbar>

    <v-snackbar :value="!!qrError" top absolute color="red">
      <span class="font-weight-bold">{{ qrError }}</span>
    </v-snackbar>

  </v-row>
</template>

<script lang="ts">
  /**
   * @see https://github.com/gruhn/vue-qrcode-reader
   */
  import {QrcodeStream, QrcodeDropZone, QrcodeCapture} from 'vue-qrcode-reader';
  import {defineComponent, ref, computed} from 'vue';
  import {useGetters, useActions, useState} from '@/plugins/vuex-helpers';

  export default defineComponent({
    components: {
      QrcodeStream,
      QrcodeDropZone,
      QrcodeCapture,
    },
    setup() {
      const {addScoreToUser} = useActions('admin', ['addScoreToUser']);
      const {addScorePending, addScoreError} = useState('admin', ['addScorePending', 'addScoreError']);

      const snackbarShow = ref(false);
      const snackbarMessage = ref('');
      const camera = ref('auto');
      const noRearCamera = ref(false);
      const noFrontCamera = ref(false);

      const switchCamera = () => {
        switch (camera.value) {
          case 'front':
            camera.value = noRearCamera.value ? 'auto' : 'rear';
            break
          case 'rear':
            camera.value = noFrontCamera.value ? 'auto' : 'front';
            break
          case 'auto':
            const newValue = noFrontCamera.value ? 'rear' : 'front';
            camera.value = noRearCamera.value ? 'auto' : newValue;
            break
        }
      };

      const cameraIcon = computed(() => {
        const iconKey: string = camera.value as string;
        const iconsMap: any = {
          'front': 'mdi-camera-front-variant',
          'rear': 'mdi-camera-rear-variant',
          'auto': 'mdi-camera-flip-outline',
        };
        return iconsMap[iconKey];
      });

      const inited = ref(false);
      const qrError = ref('');
      const qrErrorMap: any = {
        NotAllowedError: 'ERROR: you need to grant camera access permission',
        NotFoundError: 'ERROR: no camera on this device',
        NotSupportedError: 'ERROR: secure context required (HTTPS, localhost)',
        NotReadableError: 'ERROR: is the camera already in use?',
        OverconstrainedError: 'ERROR: installed cameras are not suitable',
        StreamApiNotSupportedError: 'ERROR: Stream API is not supported in this browser',
        InsecureContextError: 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.',
      };
      const result = ref('');
      const onInit = async (promise: Promise<any>) => {
        qrError.value = '';
        try {
          await promise;
          inited.value = true;
        } catch (error) {
          const triedFrontCamera = camera.value === 'front';
          const triedRearCamera = camera.value === 'rear';

          const cameraMissingError = error.name === 'OverconstrainedError';

          if (triedRearCamera && cameraMissingError) {
            noRearCamera.value = true;
            snackbarMessage.value = 'Нет задницы';
          }

          if (triedFrontCamera && cameraMissingError) {
            noFrontCamera.value = true;
            snackbarMessage.value = 'Нет фронтальной камеры';
          }

          const errorName: string = error.name as string;
          qrError.value = qrErrorMap?.[errorName] || `ERROR: Camera error (${error.name})`;
        }
      }

      const onDecode = async (input: string) => {
        result.value = input;
        const isSuccess = await addScoreToUser({
          email: result.value,
          delta: score.value,
        });
        if (isSuccess) {
          snackbarShow.value = true;
          snackbarMessage.value = result.value;
        }
      }

      const score = ref(5);
      const scoresList = computed(() => {
        return [
          5,
          10,
          15,
          20,
          25,
          30,
          35,
          40,
          45,
          50,
          100,
          -5,
          -10,
          -20,
          -50,
          -100,
        ];
      });

      return {
        result,
        onInit,
        onDecode,
        camera,
        cameraIcon,
        noRearCamera,
        noFrontCamera,
        switchCamera,
        snackbarShow,
        snackbarMessage,
        inited,
        qrError,
        score,
        addScorePending,
        addScoreError,
        scoresList,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .qr-wrapper {
    overflow: hidden;
  }
</style>