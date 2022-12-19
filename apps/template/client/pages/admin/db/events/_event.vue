<template>
  <div>
    <v-row class="mb-4" no-gutters>
      <h2>{{ eventName }}</h2>
    </v-row>
    <nuxt-child :event-data="eventData" />
  </div>
</template>

<script lang="ts">
  import {defineComponent, getCurrentInstance, computed} from 'vue';
  import {useGetters} from '@/plugins/vuex-helpers';
  import {EventDto, SectionDto} from '@/dto';

  export default defineComponent({
    async middleware(ctx) {
      await ctx.store.dispatch('event/fetchOneEvent', ctx.route.params.event);
    },

    setup() {
      const instance = getCurrentInstance();
      const root = instance?.proxy;

      let eventId: number;
      if (root?.$route) {
        eventId = Number(root.$route.params.event);
      }
      const {eventsList} = useGetters('event', ['eventsList']);
      const eventData = computed(() => {
        return eventsList?.value?.find(
          (event: EventDto) => Number(event.id) === eventId
        );
      });
      const eventName = computed((): string => {
        return eventData?.value?.name || '';
      });

      return {
        eventsList,
        eventData,
        eventName,
      };
    },
  })
</script>
