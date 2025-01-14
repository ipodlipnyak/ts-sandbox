<template>
  <v-card color="blue" variant="tonal" :loading="myStore.subscriptionsPending">
    <v-toolbar>
      <v-toolbar-title>Subscriptions</v-toolbar-title>
      <v-spacer />
      <v-btn @click="myStore.fetchMySubscriptions" :loading="myStore.subscriptionsPending" icon="mdi-refresh" variant="tonal"></v-btn>
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
      :items="myStore.subscriptions"
      height="320"
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

    return {
      myStore,
      makeFriend,
      makeFriendPending,
      newFriendEmail,
      errorMessage,
      errorState,
    }
  },
})
</script>
