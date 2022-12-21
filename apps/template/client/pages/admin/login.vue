<template>
  <v-container class="fill-height px-10 px-md-0">
    <v-row class="fill-heigth" justify="center">
      <v-card class="pa-4" rounded="lg">
      <v-form @submit.prevent="submit" ref="form" v-model="valid">
      <v-row>
      <v-col cols="12">
        <v-text-field
          type="password"
          label="Пароль"
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required]"
          @click:append="showPassword = !showPassword"
        />
      </v-col>
      <v-col cols="12" class="mt-5">
        <v-btn :disabled="!valid" type="submit" color="blue" block depressed >
          <span class="white--text">Войти</span>
        </v-btn>
      </v-col>

      </v-row>
      </v-form>
      </v-card>
    </v-row>
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
import { useState, useActions } from '@/plugins/vuex-helpers'

export default defineComponent({
  setup() {
    const form = ref(null);
    const instance = getCurrentInstance()
    const root = instance?.proxy
    const password = ref('')
    const isMounted = ref(false)
    onMounted(() => {
      isMounted.value = true
    })

    const valid = ref(true);

    const rules = computed(() => {
      return {
        required: (value: string) => !!value || 'Требуется указать'
      }
    });

    const validate = () => {
      // @ts-expect-error
      form.value.validate();
    }

    const showPassword = ref(false);

    const { loginPending, isAdmin } = useState('admin', [
      'loginPending',
      'isAdmin',
    ])
    const { login } = useActions('admin', ['login'])
    const submit = async () => {
      validate();

      if (valid.value) {
        await login(password.value);
      }
    };

    watch(isAdmin, () => {
      try {
        if (root?.$router?.push && isMounted) {
          root.$router.replace({ name: 'admin' })
        }
      } catch (e) {
        //
      }
    })

    return {
      valid,
      rules,
      password,
      submit,
      showPassword,
      form,
      isMounted,
    }
  },
})
</script>
