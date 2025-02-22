<template>
  <div ref="telegramButtonRef" />
</template>

<script setup lang="ts">
/**
 * @see https://core.telegram.org/widgets/login
 */
import { useTelegramUsersStore } from '@/stores';

type TelegramUserType = {
  id: string,
  first_name: string,
  last_name: string,
  username: string,
  photo_url: string,
  auth_date: string,
  hash: string,
}
const telegramUsersStore = useTelegramUsersStore();

const props = defineProps<{
  botName: string
}>();

const emit = defineEmits<{
  (e: 'callback', user: TelegramUserType): void,
  (e: 'loaded'): void,
}>();

const onTelegramAuth = (user: TelegramUserType) => {
  emit('callback', user);
}

const telegramButtonRef = ref();

const botName = computed(() => {
  return telegramUsersStore.botName;
});

const initButton = () => {
  const script = document.createElement("script");
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?3'

  script.setAttribute('data-size', 'large');
  script.setAttribute('data-userpic', 'false');
  script.setAttribute('data-request-access', 'read');
  script.setAttribute('data-telegram-login', props.botName);
  script.setAttribute('data-radius', '8');

  script.onload = (input) => {
    emit('loaded');
  }

  script.setAttribute('data-onauth', 'onTelegramAuthGlobal(user)');

  telegramButtonRef.value.appendChild(script)
}

onMounted(() => {
  // Lets the chaos gods bespoken and be allowed me thus sin. This is a danger zone
  var onTelegramAuthGlobal = onTelegramAuth;
  initButton();
})

onUnmounted(() => {
  var onTelegramAuthGlobal = undefined;
})
</script>
