import { TelegramCommandsListRunner } from './telegram-commands-list.command';
import { TelegramWebhookInfoRunner } from './telegram-webhook-info.command';
import { TelegramWebhookSetRunner } from './telegram-webhook-set.command';

export const commands = [TelegramWebhookInfoRunner, TelegramWebhookSetRunner, TelegramCommandsListRunner];
