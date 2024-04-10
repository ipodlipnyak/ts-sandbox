<template>
  <v-card color="green" variant="tonal" :loading="myStore.friendsPending">
    <v-toolbar>
      <v-toolbar-title>My pals</v-toolbar-title>
      <v-spacer />
      <v-btn @click="myStore.fetchMyFriends" :loading="myStore.friendsPending" icon="mdi-refresh" variant="tonal"></v-btn>
    </v-toolbar>

    <v-text-field v-model="newFriendEmail" :loading="makeFriendPending" class="ma-4" variant="solo-filled" label="Make a friend">
      <template v-slot:append-inner>
        <v-btn @click="makeFriend" :loading="makeFriendPending" variant="tonal" icon="mdi-human-baby-changing-table"></v-btn>
      </template>
    </v-text-field>

    <v-divider/>

    <v-virtual-scroll
      :items="myStore.friends"
      height="400"
      item-height="48"
    >
      <template v-slot:default="{ item }">
        <my-friends-accepted-item
          :name="[item?.firstName, item?.middleName, item?.lastName].filter((el) => !!el).join(' ') || 'Anonimus'"
          :email="item.email"
          :picture="item.pictureUrl"
        />
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';
import { useMyStore } from '~/stores';

export default defineComponent({
  setup(props, ctx) {
    const myStore = useMyStore();
    myStore.fetchMyFriends();

    const newFriendEmail = ref('');
    const makeFriendPending = ref(false);
    const makeFriend = async () => {
      makeFriendPending.value = true;

      const query = gql`
        mutation MakeFriend($email: String!) {
          makeFriend(email: $email) {
            email
          }
        }
      `;
      const variables = {
        email: newFriendEmail.value
      };
      const { mutate } = useMutation(query, {variables});
      await mutate();

      makeFriendPending.value = false;
      await myStore.fetchMyFriends();
      myStore.fetchMyFollowers();
      myStore.fetchMySubscriptions();
      newFriendEmail.value = '';
    };

    return {
      myStore,
      makeFriend,
      makeFriendPending,
      newFriendEmail,
    }
  },
})
</script>
