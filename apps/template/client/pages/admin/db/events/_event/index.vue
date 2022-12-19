<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Поиск" single-line hide-details />
      </v-card-title>
      <v-data-table :sort-by.sync="sortBy" :headers="headers" :items="sectionsList" :items-per-page="10"
        :loading="eventsListPending" :search="search" class="elevation-1">
        <template v-slot:top>
          <vs-new-table-item ref="crud" :fields="newFormFields" @save="saveSection" />
        </template>
        <template #item.actions="{ item }">
          <v-row>
            <!--
            <v-col align="end">
              <v-btn :to="`/admin/db/events/${item.id}`" nuxt block>Лекторы</v-btn>
            </v-col>
            -->
            <v-col align="end">
              <v-btn icon @click.stop="editSection(item)" color="blue" dark>
                <v-icon small>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-col>
            <v-col align="end">
              <v-btn icon @click.stop="deleteSection(item)" color="red" dark>
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
  import {defineComponent, getCurrentInstance, computed, ref, onMounted} from 'vue';
  import {useGetters, useActions, useState} from '@/plugins/vuex-helpers';
  import {EventDto, SectionDto} from '@/dto';

  export default defineComponent({
    props: {
      eventData: {
        type: Object,
        default: undefined,
      },
    },
    setup(props, ctx) {
      const eventComputed = computed((): EventDto => {
        return props.eventData as EventDto || undefined;
      });
      const sectionsList = computed((): SectionDto[] => {
        return eventComputed?.value?.sections || [];
      });
      const {eventsListPending} = useState('event', ['eventsListPending']);
      const {updateAndSaveEvent} = useActions('event', ['updateAndSaveEvent']);

      const search = ref('');
      const sortBy = ref('name');
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
          text: 'Ссылка',
          // align: 'center',
          value: 'link',
        },
        {
          text: '',
          align: 'end',
          value: 'actions',
          width: 150,
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
            name: 'link',
            type: 'text',
            label: 'Ссылка',
          },
        ];
      });

      const deleteSection = (input: any) => {
        const sections = [
          ...eventComputed.value?.sections || [],
        ];
        const indexToDelete = sections.findIndex((el) => el.id === input.id);
        sections.splice(indexToDelete, 1);
        const newEventData: EventDto = {
          ...eventComputed.value,
          sections,
        };
        updateAndSaveEvent(newEventData);
      }

      const saveSection = (input: any) => {
        const allSections = [...eventComputed.value?.sections || []];
        if (input?.id) {
          // update existed item
          const sectionIndex = allSections.findIndex((el) => el.id === input.id);
          allSections[sectionIndex] = input;
        } else {
          // create new item
          allSections.push(input);
        }

        const newEventData: EventDto = {
          ...eventComputed.value,
          sections: allSections,
        };
        updateAndSaveEvent(newEventData);
      };

      const crud = ref(undefined);
      const editSection = (item: SectionDto) => {
        const refCrud: any = crud.value as any;
        if (refCrud) {
          refCrud?.editItem(item);
        }
      };

      return {
        crud,
        editSection,
        sortBy,
        deleteSection,
        saveSection,
        newFormFields,
        search,
        headers,
        eventComputed,
        sectionsList,
        eventsListPending,
      };
    },
  });
</script>