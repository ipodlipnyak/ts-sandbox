<template>
  <v-card
    :loading="pendingCal"
    :color="cal?.backgroundColor || 'blue'"
    variant="tonal"
    width="100%"
  >
    <v-toolbar>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-content-copy" variant="tonal" @click="copyLink" class="mr-2"></v-btn>
      <v-btn icon="mdi-link-variant" variant="tonal" target="_blank_" :href="calEmbedUrl"></v-btn>
    </v-toolbar>
    <v-card-item>
      <v-card-title>
        {{ cal.summary }}
      </v-card-title>
      <v-card-subtitle>
        {{ cal.timeZone }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      {{ cal.description }}
    </v-card-text>

    <v-card-actions>
      <v-btn color="info" variant="tonal" width="200" icon="mdi-pencil"></v-btn>
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
import type { RestResponseDto } from '../../../../src/dto';

export default defineComponent({
  props: {
    calendarId: String,
  },

  setup(props, ctx) {
    const calId = props.calendarId || '';

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
      pendingCal.value = false;
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
    }
  },
})
</script>
