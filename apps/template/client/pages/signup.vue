<template>
  <v-container class="fill-height px-10 px-md-0 pt-10 pb-16 pb-md-0">
    <v-row class="fill-heigth" justify="center">
      <alfa-card rounded="lg" max-width="600">
        <v-form ref="form" class="pa-2" @submit.prevent="submit" v-model="valid">
          <v-row dense>
            <v-col cols="12">
              <alfa-select v-model="trackId" :items="tracks" item-text="name" item-value="id"
                label="Выберите учебный трек" class="mb-6" />
            </v-col>
            <v-col cols="12">
              <alfa-text-field :rules="[rules.required, rules.email]" label="Email" v-model="email" />
            </v-col>
            <v-col cols="12">
              <alfa-text-field :rules="[rules.required]" label="Имя" v-model="firstName" />
            </v-col>
            <v-col cols="12">
              <alfa-text-field :rules="[rules.required]" label="Отчество" v-model="middleName" />
            </v-col>
            <v-col cols="12">
              <alfa-text-field :rules="[rules.required]" label="Фамилия" v-model="lastName" />
            </v-col>
            <v-col cols="12">
              <alfa-text-field label="Пароль" v-model="password"
                type="password" :rules="[rules.required]"
                 />
            </v-col>
            <v-col cols="12">
              <alfa-text-field type="password" label="Повторите пароль" v-model="passwordCheck"
                :rules="[rules.required, rules.passmatch]" />
            </v-col>
            <v-col cols="12" class="mt-7 mb-10 mb-md-0">
              <alfa-btn :disabled="!valid" type="submit" color="blue" block x-large>
                <span class="white--text">Зарегистрироваться</span>
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
    getCurrentInstance,
  } from 'vue'
  import {useState, useActions, useGetters} from '@/plugins/vuex-helpers'

  export default defineComponent({
    transition: 'scroll-x-transition',
    layout: 'landing',
    middleware: [
      'auth',
      (ctx) => {
        ctx.store.commit('layout/SET_FOOTER_ABSOLUTE', true);
      },
    ],
    setup(props, ctx) {
      const form = ref(null);
      const instance = getCurrentInstance();
      const root = instance?.proxy;

      const {tracks} = useGetters('track', ['tracks']);

      const password = ref('');
      const passwordCheck = ref('');
      const email = ref('');
      const firstName = ref('');
      const middleName = ref('');
      const lastName = ref('');
      const trackId = ref(undefined);

      const isMounted = ref(false);
      onMounted(() => {
        isMounted.value = true
      })

      const valid = ref(true);

      const rules = computed(() => {
        return {
          required: (value: string) => !!value || 'Требуется указать',
          passmatch: (value: string) => password.value === value || 'Пароли не совпадают',
          email: (value: string) => /.+@.+\..+/.test(value) || 'Должен быть email',
        };
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
      const {signup} = useActions('auth', ['signup'])
      const submit = async () => {
        validate();
        if (valid) {
          signup({
            password: password.value,
            email: email.value,
            firstName: firstName.value,
            middleName: middleName.value,
            lastName: lastName.value,
            trackId: trackId.value,
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
        passwordCheck,
        email,
        submit,
        showPassword,
        form,
        errorMessage,
        tracks,
        trackId,
        firstName,
        middleName,
        lastName,
      }
    },
  })
</script>