<template>
  <v-container class="fill-height px-10 px-md-0">
    <v-row class="fill-heigth" justify="center" dense>
      <alfa-card max-width="600" rounded="lg">
        <v-row class="my-16">
          <v-col class="text-center">
            <span class="text-h3">Вход в аккаунт</span>
          </v-col>
        </v-row>
        <v-form ref="form" class="pa-2" @submit.prevent="submit" v-model="valid">
          <v-row>
            <v-col cols="12">
              <alfa-text-field :rules="[rules.required, rules.email]" label="Логин" v-model="email" />
              <!--
              <v-text-field :rules="[rules.required, rules.email]" label="Логин" v-model="email" />
              -->
            </v-col>
            <v-col cols="12">
              <alfa-text-field type="password" label="Пароль" v-model="password" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" class="mt-10">
              <alfa-btn :disabled="!valid" type="submit" color="blue" block depressed x-large>
                <span class="white--text">Войти</span>
              </alfa-btn>
            </v-col>

          </v-row>
        </v-form>
      </alfa-card>
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
  } from 'vue';
  import {useAuthStore} from '@/stores/auth';

  export default defineComponent({
    transition: 'scroll-x-transition',
    // layout: 'landing',
    middleware: [
      'auth',
    ],
    setup(props, ctx) {
      const authStore = useAuthStore();

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

      const {loginPending, errorMessage} = useState('auth', [
        'loginPending',
        'errorMessage',
      ]);
      const {loggedIn} = useGetters('auth', [
        'loggedIn',
      ]);
      const {login} = useActions('auth', ['login'])
      const submit = async () => {
        validate();
        if (valid) {
          login({
            password: password.value,
            login: email.value,
          });
        }
      };

      watch(loggedIn, () => {
        try {
          if (root?.$router?.push && isMounted) {
            root.$router.replace({name: 'index'})
          }
        } catch (e) {
          //
        }
      })

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