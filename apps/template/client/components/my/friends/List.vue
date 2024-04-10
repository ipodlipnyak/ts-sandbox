<template>
  <v-card color="blue" variant="tonal" :loading="refreshIsPending">
    <v-toolbar>
      <v-toolbar-title>Friends</v-toolbar-title>
      <v-spacer />
      <v-btn @click="refresh" :loading="refreshIsPending" icon="mdi-refresh" variant="tonal"></v-btn>
    </v-toolbar>

    <v-text-field
      v-model="newFriendEmail"
      :loading="makeFriendPending"
      :error="errorState"
      :error-messages="errorMessage"
      class="ma-4"
      variant="solo-filled"
      label="Invite to be a friend"
    >
      <template v-slot:append-inner>
        <v-btn @click="makeFriend" :loading="makeFriendPending" variant="tonal" icon="mdi-paw"></v-btn>
      </template>
    </v-text-field>

    <v-divider/>

    <v-virtual-scroll
      :items="friendsList"
      height="calc(100vh - 300px)"
      item-height="48"
    >
      <template v-slot:default="{ item }">
        <my-friends-subscriptions-item
          :name="[item.firstName, item.middleName, item.lastName].filter((el) => !!el).join(' ') || 'Anonimus'"
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
    myStore.fetchMySubscriptions();

    const errorState = ref(false);
    const errorMessage = ref('');

    const newFriendEmail = ref('');

    watch(
      newFriendEmail,
      () => {
        errorState.value = false;
        errorMessage.value = '';
      }
    );

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
        email: newFriendEmail.value
      };
      const { mutate, error } = useMutation(query, {variables});

      try {
        await mutate();
        await myStore.fetchMyFriends();
        myStore.fetchMySubscriptions();
        myStore.fetchMyFollowers();
        newFriendEmail.value = '';
      } catch(e) {
        const eMsg = error.value?.message;
        if (eMsg) {
          errorMessage.value = eMsg;
        }
      }

      makeFriendPending.value = false;
    };

    const friendsList = computed(() => {
      return [
        ...myStore.friends,
        ...myStore.subscriptions,
        // ...myStore.followers,
      ];
    });

    const refreshIsPending = computed(() => {
      return myStore.friendsPending || myStore.subscriptionsPending;
    });
    const refresh = () => {
      myStore.fetchMyFriends();
      myStore.fetchMySubscriptions();
    }

    refresh();

    return {
      myStore,
      makeFriend,
      makeFriendPending,
      newFriendEmail,
      errorMessage,
      errorState,
      friendsList,
      refresh,
      refreshIsPending,
    }
  },
})
</script>
