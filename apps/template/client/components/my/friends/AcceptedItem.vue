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
      <v-btn @click="unmakeFriend" :loading="unmakeFriendPending" variant="tonal" color="red" icon="mdi-axe"></v-btn>
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
        mutation MakeFriend($email: String!) {
          unmakeFriend(email: $email) {
            status
          }
        }
      `;
      const variables = {
        email: props.email,
      };
      const { mutate } = useMutation(query, {variables});
      await mutate();

      unmakeFriendPending.value = false;
      await myStore.fetchMyFriends();
      myStore.fetchMyFollowers();
      myStore.fetchMySubscriptions();
    };
    return {
      unmakeFriend,
      unmakeFriendPending,
    }
  },
})
</script>
