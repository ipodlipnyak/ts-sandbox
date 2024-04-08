<template>
  <v-card
    :loading="pendingCal"
    :color="cal?.backgroundColor || 'blue'"
    variant="tonal"
    width="100%"
  >
    <v-toolbar>
      <v-toolbar-title>Meta</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-content-copy" variant="tonal" @click="copyLink" class="mr-2"></v-btn>
      <v-btn icon="mdi-link-variant" variant="tonal" target="_blank_" :href="calEmbedUrl"></v-btn>
    </v-toolbar>

    <v-form class="mt-2">
      <v-card-item>
        <v-text-field
          label="Title"
          v-model="newCalendarTitle"
          variant="solo-filled"
        ></v-text-field>
        <v-card-subtitle>
          {{ cal.timeZone }}
        </v-card-subtitle>
      </v-card-item>
   
      <!--
      <v-textarea
        label="Description"
        v-model="newCalendarDescription"
        variant="solo-filled"
        class="ma-4"
      ></v-textarea>
      -->
    </v-form>

    <v-card-actions>
      <v-btn color="green" @click="patchCal" :loading="patchCalPending" variant="tonal" width="100" icon="mdi-content-save"></v-btn>
      <v-btn color="yellow" :loading="pendingCal" @click="fetchCal" variant="tonal" width="100" icon="mdi-refresh"></v-btn>
      <v-spacer />
        <v-overlay
          location-strategy="connected"
          scroll-strategy="block"

        >
        <template #activator="{ isActive, props }">
          <v-btn v-bind="props" color="error" variant="tonal" icon="mdi-delete"></v-btn>
        </template>
          <v-btn
            @click="deleteCalendar"
            icon="mdi-check"
            variant="flat"
            color="red"
            class="mt-2"
            :loading="deleteCalendarPending"
            :disabled="deleteCalendarPending"
          >
          </v-btn>

        </v-overlay>

    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { calendar_v3 } from 'googleapis';
import type { GoogleCalendarDto, RestResponseDto } from '../../../../src/dto';

export default defineComponent({
  props: {
    calendarId: String,
  },

  setup(props, ctx) {
    const calId = props.calendarId || '';

    const newCalendarTitle = ref('');
    const newCalendarDescription = ref('');

    const router = useRouter();

    const pendingCal = ref(false);

    const cal = ref({} as calendar_v3.Schema$CalendarListEntry);

    const calUrl = computed(() => `/api/calendar/${encodeURIComponent(calId)}/`);

    const timeZone = computed(() => {
      return cal.value.timeZone || 'Europe/Moscow';
    });
    const apiCalEmbedURL = 'https://calendar.google.com/calendar/embed'; 
    const calEmbedUrl = computed(() => `${apiCalEmbedURL}?src=${encodeURIComponent(calId)}&ctz=${encodeURIComponent(timeZone.value)}`);
    const copyLink = () => {
       navigator.clipboard.writeText(calEmbedUrl.value);
    };
    
    const fetchCal = async () => {
      pendingCal.value = true;
      const { data } = await useFetch(calUrl.value);
      const response = data.value as RestResponseDto; 
      cal.value = response.payload;
      newCalendarTitle.value = cal.value.summary || '';
      newCalendarDescription.value = cal.value.description || '';
      pendingCal.value = false;
    }

    const patchCalPending = ref(false);
    const patchCal = async () => {
      if (!newCalendarTitle.value || newCalendarTitle.value === cal.value.summary) {
        return;
      }

      patchCalPending.value = true;

      const body: GoogleCalendarDto = {
        summary: newCalendarTitle.value
      }

      const { data } = await useFetch(calUrl.value, {
        method: 'patch',
        body,
      });
      const response = data.value as RestResponseDto;
      cal.value = {
        ...cal.value,
        ...response.payload,
      };

      patchCalPending.value = false;
    }

    const deleteCalendarPending = ref(false);
    const deleteCalendar = async () => {
      deleteCalendarPending.value = true;
      const { data } = await useFetch(calUrl.value, {
        method: 'delete',
      });
      deleteCalendarPending.value = false;
      router.push('/admin/calendar');
    }

    fetchCal();

    return {
      cal,
      pendingCal,
      copyLink,
      calEmbedUrl,
      deleteCalendar,
      deleteCalendarPending,
      newCalendarTitle,
      newCalendarDescription,
      fetchCal,
      patchCal,
      patchCalPending,
    }
  },
})
</script>
