<template>
  <MyTelegramLoginIframe v-if="telegramUsersStore.botName" :bot-name="telegramUsersStore.botName" />
</template>

<script setup lang="ts">
/**
 * @see https://core.telegram.org/widgets/login
 */
import { useTelegramUsersStore } from '@/stores';

const telegramUsersStore = useTelegramUsersStore();
</script>
