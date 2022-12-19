<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Поиск" single-line hide-details />
      </v-card-title>
      <v-data-table :headers="headers" :items="eventsList" :items-per-page="10" :loading="eventsListPending"
        :search="search" class="elevation-1">
        <template v-slot:top>
          <vs-new-table-item ref="crud" :fields="newFormFields" @save="createNewEvent" />
        </template>
        <template #item.actions="{ item }">
          <v-row>
            <v-col align="start">
              <v-btn :to="`/admin/db/events/${item.id}`" nuxt>Мероприятия</v-btn>
            </v-col>
            <v-col align="end">
              <v-btn icon @click.stop="editEvent(item)" color="blue" dark>
                <v-icon small>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-col>
            <v-col align="end">
              <v-btn icon @click.stop="deleteEvent(item.id)" color="red" dark>
                <v-icon small>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    computed,
    reactive,
    watch,
    nextTick,
    onMounted,
  } from 'vue';
  import {useGetters, useActions, useState} from '@/plugins/vuex-helpers';
  import {EventDto} from '@/dto';

  export default defineComponent({
    middleware(ctx) {
      ctx.store.dispatch('admin/fetchAllUsers')
    },

    setup(props, ctx) {
      const {fetchAllEvents, deleteEvent, createEvents, updateAndSaveEvent} = useActions('event', [
        'fetchAllEvents',
        'deleteEvent',
        'createEvents',
        'updateAndSaveEvent',
      ]);
      const {eventsList} = useGetters('event', ['eventsList']);
      const {eventsListPending} = useState('event', ['eventsListPending']);

      onMounted(() => {
        fetchAllEvents()
      });

      const search = ref('');

      const headers = ref([
        {
          text: 'Имя',
          align: 'start',
          // sortable: false,
          value: 'name',
        },
        {
          text: 'Описание',
          // align: 'center',
          value: 'description',
        },
        {
          text: 'Начало',
          // align: 'center',
          value: 'start',
        },
        {
          text: 'Окончание',
          // align: 'center',
          value: 'end',
        },
        {
          text: 'Активен',
          // align: 'center',
          value: 'active',
        },
        {
          text: '',
          align: 'end',
          value: 'actions',
          width: 350,
        },
      ]);

      const newFormFields = computed(() => {
        return [
          {
            name: 'name',
            type: 'string',
            label: 'Название',
          },
          {
            name: 'description',
            type: 'text',
            label: 'Описание',
          },
          {
            name: 'start',
            type: 'date',
            label: 'Начало',
          },
          {
            name: 'end',
            type: 'date',
            label: 'Конец',
          },
        ];
      });

      const createNewEvent = (newEvent: EventDto) => {
        if (newEvent.id) {
          updateAndSaveEvent(newEvent);
        } else {
          createEvents([newEvent]);
        }
      };

      const crud = ref(undefined);
      const editEvent = (item: EventDto) => {
        const refCrud: any = crud.value as any;
        if (refCrud) {
          refCrud?.editItem(item);
        }
      };

      return {
        crud,
        editEvent,
        newFormFields,
        fetchAllEvents,
        headers,
        eventsList,
        eventsListPending,
        search,
        deleteEvent,
        createNewEvent,
      };
    },
  });
</script>