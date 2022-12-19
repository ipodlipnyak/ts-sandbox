<template>
  <div>
    <alfa-title>Таблица рейтинга</alfa-title>

    <v-container class="pb-16">
      <v-card rounded="lg" class="pt-12">
        <v-card class="mb-10" rounded="lg" flat color='transparent'>
          <v-tabs v-model="activeTab" show-arrows center-active grow>
            <v-tab v-for="tab in boardsFormatted" :key="tab.name"><span class="text-h6">{{ tab.nameFormatted }}</span></v-tab>
          </v-tabs>
        </v-card>
        <v-card max-width="1000" class="mx-auto mb-8" rounded="lg" flat color='transparent'>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left text-h5 black--text">
                    Место
                  </th>
                  <th class="text-left text-h5 black--text">
                    ФИО
                  </th>
                  <th class="text-right text-h5 black--text">
                    Байкоины
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in activeRating">
                  <tr :key="`${item.rate}#${index}#t`" :class="item.me ? 'blue white--text' : ''">
                    <td class="py-4 text-body-1">{{ item.rate }}</td>
                    <td class="py-4">
                      <v-sheet max-width="28vw" color="transparent">
                        <v-row no-gutters>
                          <span v-for="(name, index) in item.names" :key="index" no-gutters class="pr-1 text-body-1" :class="item.me ? 'blue white--text' : ''">
                            {{ name }}
                          </span>
                        </v-row>
                        <v-row v-if="item.track" no-gutters class="pt-2">
                          <v-sheet rounded="lg" color="blue lighten-4" class="px-4 py-1 text-truncate">
                            <span class="text-caption">{{ item.track }}</span>
                          </v-sheet>
                        </v-row>
                      </v-sheet>
                    </td>
                    <td class="text-right py-4 text-body-1">{{ item.score }}</td>
                  </tr>
                </template>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
        <v-row no-gutters justify="center" class="pb-16 px-16">
          <v-btn @click.stop="showFullRating = !showFullRating" outlined large class="px-10 py-10 text-h6"
            :block="$vuetify.breakpoint.xs">
            {{ showFullRating ? 'свернуть таблицу' : 'посмотреть всю таблицу' }}
          </v-btn>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, computed, reactive, watch, nextTick, onMounted, getCurrentInstance} from 'vue';
  import {useGetters, useActions, useState} from '@/plugins/vuex-helpers';
  import {BoardDto, MyRatingDto, DEFAULT_BOARD_NAME} from '@/dto';

  export default defineComponent({
    middleware(ctx) {
      ctx.store.dispatch('rating/fetchBoards');
    },
    setup() {
      const {rating}: {rating: any} = useGetters('auth', ['rating']);
      const {boards} = useGetters('rating', ['boards']);
      // const product: ProductDto = props.product as ProductDto;
      const boardsComputed = computed((): BoardDto[] => {
        return boards.value as BoardDto[];
      });
      const boardsFormatted = computed(() => {
        return boardsComputed.value.map((b: BoardDto) => {
          return {
            ...b,
            nameFormatted: b.name === DEFAULT_BOARD_NAME ? 'Общий рейтинг' : b.name,
          };
        });
      });
      const activeTab = ref(0);
      const activeBoard = computed(() => {
        return boardsComputed.value[activeTab.value];
      });

      const ratingOnActiveBoard = computed((): number => {
        const match: MyRatingDto = rating.value.find((el: MyRatingDto) => {
          return el.board === activeBoard.value?.name;
        });
        if (!match) {
          return 0;
        }
        return match?.rate || 0;
      });

      const showFullRating = ref(false);
      const activeRatingFull = computed(() => {
        const result = activeBoard.value?.rating || [];
        return result.map((el) => {
          const me = ratingOnActiveBoard.value && (Number(el.rate) === Number(ratingOnActiveBoard.value));
          return {
            score: el.score,
            names: [el?.user?.firstName, el?.user?.middleName, el?.user?.lastName].filter((el) => !!el),
            track: el.user?.track?.name || '',
            rate: el.rate,
            me,
          }
        });
      });

      const activeRatingShort = computed(() => {
        const rowsTreshold = 6;
        const rowsPerBlock = 3;
        const ratingValue = Number(ratingOnActiveBoard.value) || 0;
        const total = activeRatingFull.value.length;
        if (total <= rowsTreshold) {
          return activeRatingFull.value;
        }
        const raw = [...activeRatingFull.value];
        let result = raw.splice(0, rowsPerBlock);

        const dummy: any = {
          rate: '',
          names: ['...'],
          score: '',
          track: '',
          me: false,
        };

        if (!ratingValue) {
          result.push(dummy);
          return result;
        }

        if (ratingValue < rowsPerBlock) {
          result.push(dummy);
          return result;
        }

        if (ratingValue < rowsTreshold) {
          result = [
            ...result,
            ...raw.splice(0, rowsTreshold - rowsPerBlock),
          ];
          result.push(dummy);
          return result;
        }

        result.push(dummy);

        const start = ratingValue - (2 + rowsPerBlock);
        result = [
          ...result,
          ...raw.splice(start, rowsPerBlock),
        ];

        result.push(dummy);
        return result;
      });

      const activeRating = computed(() => {
        /*
        if (activeTab.value !== 0) {
          return activeRatingFull.value;
        }
        */
        return showFullRating.value ? activeRatingFull.value : activeRatingShort.value;
      });

      return {
        rating,
        ratingOnActiveBoard,
        boards,
        boardsComputed,
        boardsFormatted,
        activeBoard,
        activeRating,
        activeTab,
        showFullRating,
      }
    }
  })
</script>

<style lang="scss" scoped>
  td {
    vertical-align: top;
  }

  .bl-table-track>td {
    border-bottom: unset !important;
  }
</style>