<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-skeleton-loader color="transparent" type="card" :loading="pendingCal">
          <v-card
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
              <v-btn color="error" variant="tonal" icon="mdi-delete"></v-btn>
            </v-card-actions>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="6">

        <v-skeleton-loader type="card" :loading="pendingAcl">
          <v-card
            color="info"
            variant="tonal"
            width="100%"
          >
            <v-toolbar>
              <v-toolbar-title>Users</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-plus" variant="tonal"></v-btn>
            </v-toolbar>
            <v-virtual-scroll
              :items="acl"
              height="320"
              item-height="48"
            >
              <template v-slot:default="{ item }">
                <v-list-item
                  class="my-2"
                  :title="[item.firstName, item.middleName, item.lastName].filter((el) => !!el).join(' ')"
                  :subtitle="`${item.email}`"
                >
                  <template v-slot:prepend>
                    <v-avatar :image="item.pictureUrl" />
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-skeleton-loader>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { calendar_v3 } from 'googleapis';
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import type { CalendarAclDto, CalendarAclListResponseDto, RestResponseDto } from '../../../../src/dto';

export default defineComponent({
  middleware(ctx) {
    return ctx.redirect('/admin/event');
  },

  setup() {
    const display = useDisplay();
    const route = useRoute();
    const calId = route.params.id as string;

    const pendingCal = ref(false);
    const pendingAcl = ref(false);

    const cal = ref({} as calendar_v3.Schema$CalendarListEntry);
    const acl = ref([] as CalendarAclDto[]);

    const calUrl = computed(() => `/api/calendar/${encodeURIComponent(calId)}/`);
    const aclUrl = computed(() => `/api/calendar/${encodeURIComponent(calId)}/acl/`); 

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
    const fetchAcl = async () => {
      pendingAcl.value = true;
      const { data } = await useFetch(aclUrl.value);
      const response = data.value as CalendarAclListResponseDto; 
      acl.value = response.payload;
      pendingAcl.value = false;
    }

    fetchCal();
    fetchAcl();

    return {
      display,
      calId,
      cal,
      acl,
      pendingCal,
      pendingAcl,
      copyLink,
      calEmbedUrl,
    };
  },
})
</script>