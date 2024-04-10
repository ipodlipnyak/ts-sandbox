<template>
  <v-card color="transparent" elevation="0" class="pa-4" :href="href" target="_blank">
    <div>
      <h2 :class="`mt-n1 headline font-weight-light mb-4 text-${color}`">
        {{ summary }}
      </h2>
      <div v-if="message">
        {{ message }}
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    summary: String,
    description: String,
    location: String,
    htmlLink: String,
    color: String,
  },

  setup(props, ctx) {
    const isJitsiMeetup = computed(() => {
      return props.location?.startsWith('https://meet.jit.si/');
    });

    const href = computed(() => {
      if (isJitsiMeetup.value) {
        return props.location;
      }

      return props.htmlLink;
    });

    const message = computed(() => {
      /*
      if (isJitsiMeetup.value) {
        return '';
      }
      */

      return props.description;
    });

    return {
      isJitsiMeetup,
      href,
      message,
    }
  },
})
</script>
