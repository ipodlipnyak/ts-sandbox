<template>
  <v-container>
    <v-card class="pa-2">
      <v-form @submit.prevent="updateName">
        <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="firstName"
            :counter="10"
            label="First name"
            hide-details
            required
          ></v-text-field>
        </v-col>
        
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="middleName"
            :counter="10"
            label="Middle name"
            hide-details
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="lastName"
            :counter="10"
            label="Last name"
            hide-details
            required
          ></v-text-field>
        </v-col>

      </v-row>
      <v-row>
        <v-col>
          <v-btn :disabled="!isNameDirty" :loading="myStore.nameUpdatePendingGetter" type="submit" block>Submit</v-btn>
        </v-col>
        <v-col>
          <v-btn
            color="error"
            block
            @click="resetName"
            :disabled="!isNameDirty"
          >
            Reset Form
          </v-btn>
        </v-col>
      </v-row>
        <!--
        <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1"
          label="new pass" hint="At least 8 characters" counter
          @click:append="show1 = !show1"></v-text-field>
        -->
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { useMyStore } from '@/stores/my';

export default defineComponent({
  middleware(ctx) {
    // return ctx.redirect('/admin/db');
  },

  setup() {
    const display = useDisplay();
    const layout = useLayout();
    const authStore = useAuthStore();
    const usersStore = useUsersStore();
    const myStore = useMyStore();

    const password = ref('');
    const show1 = ref(false);
    const rules = {
      required: (value: string) => !!value || 'Required.',
      min: (v: string) => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => (`The email and password you entered don't match`),
    };

    const firstName = ref('');
    const lastName = ref('');
    const middleName = ref('');

    const isNameDirty = computed(() => {
      return [
        firstName.value === authStore.firstName,
        middleName.value === authStore.middleName,
        lastName.value === authStore.lastName,
      ].some((el) => el === false);
    });


    firstName.value = authStore.firstName;
    middleName.value = authStore.middleName;
    lastName.value = authStore.lastName;
    watch(
      () => authStore.whoami,
      () => {
        firstName.value = authStore.firstName;
        middleName.value = authStore.middleName;
        lastName.value = authStore.lastName;
      }
    );

    const resetName = () => {
      firstName.value = authStore.firstName;
      middleName.value = authStore.middleName;
      lastName.value = authStore.lastName;
    }

    const updateName = () => {
      myStore.updateName({
        firstName: firstName.value,
        lastName: lastName.value,
        middleName: middleName.value,
      });
    }

    return {
      rules,
      password,
      show1,
      display,
      authStore,
      usersStore,
      myStore,
      firstName,
      lastName,
      middleName,
      isNameDirty,
      updateName,
      resetName,
    };
  },
})
</script>