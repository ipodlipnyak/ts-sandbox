<template>
  <v-container class="fill-height px-10 px-md-0">
    <v-row class="fill-heigth" justify="center" dense>
      <v-card max-width="600" rounded="lg" class="pa-4">
        <v-row class="my-16">
          <v-col class="text-center">
            <span class="text-h3">Вход в аккаунт</span>
          </v-col>
        </v-row>
        <v-form ref="form" class="pa-2" @submit.prevent="submit" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-text-field :rules="[rules.required, rules.email]" label="Username" v-model="email" />
              <!--
              <v-text-field :rules="[rules.required, rules.email]" label="Логин" v-model="email" />
              -->
            </v-col>
            <v-col cols="12">
              <v-text-field type="password" label="Password" v-model="password" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" class="mt-10">
              <v-btn :disabled="!valid" type="submit" color="blue" block depressed size="x-large">
                <span class="white--text">Войти</span>
              </v-btn>
            </v-col>

          </v-row>
        </v-form>
      </v-card>
    </v-row>

    <v-snackbar :timeout="-1" :value="!!errorMessage" absolute color="error" top>
      <v-icon>mdi-alert-circle</v-icon><span class="font-weight-bold ml-2">{{ errorMessage }}</span>
    </v-snackbar>

  </v-container>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    computed,
    reactive,
    watch,
    nextTick,
    onMounted,
    getCurrentInstance,
  } from 'vue';
  import {useAuthStore} from '../../client/stores';
  import {storeToRefs} from 'pinia';
  import {useRouter} from 'vue-router';
  // import {definePageMeta} from 'nuxt/dist/pages/runtime/composables';

  export default defineComponent({
    transition: 'scroll-x-transition',
    // layout: 'landing',
    /*
    middleware: [
      'auth',
    ],
    */

    setup(props, ctx) {
      definePageMeta({
        // ... or multiple strings
        middleware: ['auth'],
      });

      const router = useRouter();
      const authStore = useAuthStore();
      const {login} = authStore;
      const {errorMessage, loggedIn} = storeToRefs(authStore);

      const form = ref(null);
      const password = ref('')
      const email = ref('')
      const isMounted = ref(false)
      onMounted(() => {
        isMounted.value = true
      })

      const valid = ref(true);

      const rules = computed(() => {
        return {
          required: (value: string) => !!value || 'Требуется указать',
          email: (value: string) => /.+@.+\..+/.test(value) || 'Должен быть email',
        }
      });

      const validate = () => {
        // @ts-expect-error
        form.value.validate();
      }

      const showPassword = ref(false);

      const submit = async () => {
        validate();
        if (valid) {
          login(email.value, password.value);
        }
      };
      // watch(loggedIn, () => {
      //   try {
      //     if (router?.push && isMounted) {
      //       router.replace({name: 'index'})
      //     }
      //   } catch (e) {
      //     //
      //   }
      // });

      return {
        valid,
        rules,
        password,
        email,
        submit,
        showPassword,
        form,
        errorMessage,
      }
    },
  })
</script>