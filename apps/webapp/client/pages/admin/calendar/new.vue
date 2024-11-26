
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
            <v-btn :disabled="!valid || newCalendarPending" :loading="newCalendarPending" class="mt-4" block size="large" type="submit">Submit</v-btn>
          </v-form>
        </v-card-item>
      </v-card>
    </v-container>
</template>

<script lang="ts">
import type { calendar_v3 } from 'googleapis';
import { defineComponent } from 'vue';
import type { RestResponseDto } from '../../../../src/dto';

export default defineComponent({
  setup() {
    const router = useRouter();

    const valid = ref(false);
    const summary = ref('');
    const newCalendarPending = ref(false);
    
    const createCalendar = async () => {
      newCalendarPending.value = true;
      const { data } = await useFetch('/api/calendar', {
        method: 'post',
        body: {
          summary: summary.value,
        }
      });
      newCalendarPending.value = false;
      const result = toRaw(data.value) as RestResponseDto;
      return result.payload as calendar_v3.Schema$Calendar;
    }

    const submit = async () => {
      if (valid.value) {
        const newCalendar = await createCalendar();
        const newCalId = newCalendar.id;
        const nextPage = newCalId ? `/admin/calendar/${newCalId}` : `/admin/calendar/`;
        router.push(nextPage);
        return;
      }

      // console.log('error');
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
      newCalendarPending,
    };
  },
})
</script>