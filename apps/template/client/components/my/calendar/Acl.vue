<template>
  <v-card
    :loading="pendingAcl"
    color="info"
    variant="tonal"
    width="100%"
  >
    <v-toolbar>
      <v-toolbar-title>Users</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-refresh" :loading="pendingAcl" @click="fetchAcl" variant="tonal"></v-btn>
    </v-toolbar>

    <v-text-field
      v-model="newEmail"
      variant="solo-filled"
      class="ma-4"
      label="E-mail"
      :loading="pendingAddReader"
    >
      <template v-slot:append-inner>
        <v-btn :loading="pendingAddReader" @click="addReader" variant="tonal" icon="mdi-plus"></v-btn>
      </template>
    </v-text-field>

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
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { CalendarAclDto, CalendarAclListResponseDto, GoogleCalendarAclDto, RestResponseDto } from '../../../../src/dto';

export default defineComponent({
  props: {
    calendarId: String,
  },

  setup(props, ctx) {
    const pendingAcl = ref(false);
    const acl = ref([] as CalendarAclDto[]);
    const aclUrl = computed(() => `/api/calendar/${encodeURIComponent(props.calendarId || '')}/acl/`); 
    const fetchAcl = async () => {
      pendingAcl.value = true;
      const { data } = await useFetch(aclUrl.value);
      const response = data.value as CalendarAclListResponseDto; 
      acl.value = response.payload;
      pendingAcl.value = false;
    }

    const newEmail = ref('');
    const pendingAddReader = ref(false);
    const addReader = async () => {
      if (!newEmail.value) {
        return;
      }

      pendingAddReader.value = true;
      const body: GoogleCalendarAclDto = {
        role: 'reader',
        scope: {
          type: 'user',
          value: newEmail.value
        }
      }
      const { data } = await useFetch(aclUrl.value, {
        method: 'post',
        body,
      });

      fetchAcl();
      pendingAddReader.value = false;
    }

    fetchAcl();

    return {
      fetchAcl,
      acl,
      pendingAcl,
      newEmail,
      addReader,
      pendingAddReader,
    }
  },
})
</script>
