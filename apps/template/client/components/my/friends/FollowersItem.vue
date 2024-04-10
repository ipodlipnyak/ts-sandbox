<template>
  <v-list-item
    class="my-2"
    :title="name"
    :subtitle="email"
  >
    <template v-slot:prepend>
      <v-avatar icon="mdi-incognito" :image="picture" />
    </template>
    <template v-slot:append>
      <v-btn variant="tonal" @click="makeFriend" :loading="makeFriendPending" class="mr-2" color="green" icon="mdi-human-greeting-variant"></v-btn>
      <v-btn variant="tonal" @click="unmakeFriend" :loading="unmakeFriendPending" color="red" icon="mdi-karate"></v-btn>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useMyStore } from '~/stores';

export default defineComponent({
  props: {
    name: String,
    email: String,
    picture: String,
  },

  setup(props, ctx) {
    const myStore = useMyStore();

    const unmakeFriendPending = ref(false);
    const unmakeFriend = async () => {
      unmakeFriendPending.value = true;

      const query = gql`
        mutation unmakeFriend($email: String!) {
          unfollow(email: $email) {
            status
          }
        }
      `;
      const variables = {
        email: props.email
      };
      const { mutate } = useMutation(query, {variables});
      await mutate();

      unmakeFriendPending.value = false;
      await myStore.fetchMyFriends();
      myStore.fetchMyFollowers();
      myStore.fetchMySubscriptions();
    };

    const makeFriendPending = ref(false);
    const makeFriend = async () => {
      makeFriendPending.value = true;

      const query = gql`
        mutation MakeFriend($email: String!) {
          subscribe(email: $email) {
            email
          }
        }
      `;
      const variables = {
        email: props.email
      };
      const { mutate } = useMutation(query, {variables});
      await mutate();

      makeFriendPending.value = false;
      await myStore.fetchMyFriends();
      myStore.fetchMySubscriptions();
      myStore.fetchMyFollowers();
    };

    return {
      makeFriend,
      makeFriendPending,
      unmakeFriend,
      unmakeFriendPending,
    }
  },
})
</script>
