
<template>
    <v-container>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Calendars</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="tonal" to="/admin/calendar"></v-btn>
        </v-toolbar>

        <v-card-item>
          <v-form v-model="valid" @submit.prevent="submit">
            <v-text-field
              class="mt-2"
              label="Title"
              v-model="summary"
              :rules="nameRules"
            />
            <v-btn :disabled="!valid" class="mt-4" block size="large" type="submit">Submit</v-btn>
          </v-form>
        </v-card-item>
      </v-card>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const router = useRouter();

    const valid = ref(false);
    const summary = ref('');
    const submit = () => {
      if (valid.value) {
        console.log(summary.value);
        router.push('/admin/calendar/');
        return;
      }

      console.error('FUCK you')
    }
    const nameRules = [
      (value: string) => {
        if (value) return true

        return 'Name is required.'
      },
      (value: string) => {
        if (value?.length <= 50) return true

        return 'Name must be less than 50 characters.'
      },
    ];


    return {
      summary,
      submit,
      nameRules,
      valid,
    };
  },
})
</script>