<template>
  <div>
    <v-row class="mb-4" no-gutters>
      <h2>{{ fullName }}</h2>
      <v-spacer />
      <h2>
        Доступно байкоинов: <span class="red--text">{{ total }}</span>
      </h2>
      <v-spacer />
      <h2>
        Рейтинг: <span class="red--text">{{ score }}</span>
      </h2>
    </v-row>
    <nuxt-child :user-data="userData" />
  </div>
</template>

<script lang="ts">
  import {defineComponent, getCurrentInstance, computed} from 'vue';
  import {useGetters} from '@/plugins/vuex-helpers';
  import {UserDto} from '@/dto';

  export default defineComponent({
    async middleware(ctx) {
      await ctx.store.dispatch('admin/fetchOneUser', ctx.route.params.user);
    },

    setup() {
      const instance = getCurrentInstance();
      const root = instance?.proxy;

      let userId: number;
      if (root?.$route) {
        userId = Number(root.$route.params.user);
      }
      const {usersList} = useGetters('admin', ['usersList']);
      const userData = computed(() => {
        return usersList?.value?.find(
          (user: UserDto) => Number(user.id) === userId
        );
      });
      const fullName = computed(() => {
        return userData?.value?.fullName || userData?.value?.email || '';
      });
      const score = computed(() => {
        return userData?.value?.score || 0;
      });
      const total = computed(() => {
        return userData?.value?.total || 0;
      });

      return {
        usersList,
        userData,
        fullName,
        score,
        total,
      };
    },
  })
</script>
