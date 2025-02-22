/**
 * @see https://core.telegram.org/bots/api#making-requests
 */
export type Response<T = any> = ReposnseError | ReposnseSuccess<T>;

class ReposnseSuccess<T> {
  ok!: true;
  result?: T;
  description?: string;
}

class ReposnseError {
  ok!: false;
  migrate_to_chat_id?: string;
  retry_after?: string;
}

/**
 * @see https://core.telegram.org/bots/api#botcommand
 */
export class BotCommand {
  command: string;
  description: string;
}

/**
 * @see https://core.telegram.org/bots/api#webhookinfo
 */
export class WebhookInfo {
  url: string;
  has_custom_certificate: string;
  ip_address: string;
  pending_update_count: string;
  last_error_date: string;
  last_error_message: string;
  last_synchronization_error_date: string;
  max_connections: string;
  allowed_updates: string[];
}

/**
 * @see https://core.telegram.org/bots/api#user
 */
export class User {
  id: string;
  username: string;
  last_name: string;
  first_name: string;
}

/**
 * @see https://core.telegram.org/bots/api#chat
 */
export class Chat {
  id: string;
  username: string;
  last_name: string;
  first_name: string;
  type: string;
}

/**
 * @see https://core.telegram.org/bots/api#message
 */
export class Message {
  text: string;
  date: string;
  message_id: string;
  from: User;
  chat: Chat;
}

/**
 * @see https://core.telegram.org/bots/api#sendchataction
 * Type of action to broadcast.
 * Choose one, depending on what the user is about to receive:
 * - typing for text messages,
 * - upload_photo for photos,
 * - record_video or upload_video for videos,
 * - record_voice or upload_voice for voice notes,
 * - upload_document for general files,
 * - choose_sticker for stickers,
 * - find_location for location data,
 * - record_video_note or upload_video_note for video notes.
 */
export type ChatAction = 'typing' | 'upload_photo' | 'record_video' | 'record_voice' | 'upload_document' | 'choose_sticker' | 'find_location' | 'record_video_note' | 'upload_video_note';
