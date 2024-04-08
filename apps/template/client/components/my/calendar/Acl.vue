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
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { CalendarAclDto, CalendarAclListResponseDto, RestResponseDto } from '../../../../src/dto';

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

    fetchAcl();

    return {
      fetchAcl,
      acl,
      pendingAcl,
    }
  },
})
</script>
