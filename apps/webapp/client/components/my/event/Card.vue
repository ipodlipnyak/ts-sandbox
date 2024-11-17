<template>
  <v-card rounded="xl" color="info" class="mt-n1" variant="tonal" :href="href" target="_blank">
    <v-list-item>
      <template v-slot:prepend>
        <v-icon v-if="showStatus" icon="mdi-circle" :color="colorComputed"></v-icon>
      </template>
      <v-list-item-title>
        {{ message }}
      </v-list-item-title>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    showTime: {
      type: Boolean,
      default: false
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    summary: String,
    description: String,
    location: String,
    htmlLink: String,
    color: String,
    start: String,
    end: String,
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

    const colorComputed = computed(() => {
      if (props.color) {
        return props.color;
      }

      const { start, end } = props;
      const dtNow = new Date();
      const dtStart = new Date(start || '');
      const dtEnd = new Date(end || '');

      if (+dtNow <= +dtEnd && +dtNow >= +dtStart) {
        return 'green';
      }

      if (+dtNow <= +dtStart) {
        return 'yellow';
      }

      return 'red';
    });

    const message = computed(() => {
      let result = props.summary;

      if (props.showTime && props.start) {
        const dtStart = new Date(props.start)
        const time = dtStart.toLocaleString().slice(0, -3);
        result = `${time} ${result}`;
      }

      return result;
    });

    return {
      isJitsiMeetup,
      href,
      colorComputed,
      message,
    }
  },
})
</script>
