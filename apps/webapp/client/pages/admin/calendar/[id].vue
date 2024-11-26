<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <my-calendar-meta :calendar-id="calId" />
        <my-calendar-events class="mt-6" :calendar-id="calId" />
      </v-col>
      <v-col cols="12" md="6">

        <my-calendar-acl :calendar-id="calId" />

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { calendar_v3 } from 'googleapis';
import { defineComponent } from 'vue';
import type { RestResponseDto } from '../../../../src/dto';

export default defineComponent({
  middleware(ctx) {
    return ctx.redirect('/admin/event');
  },

  setup() {
    const route = useRoute();
    const calId = route.params.id as string;

    return {
      calId,
    };
  },
})
</script>