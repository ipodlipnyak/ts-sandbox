
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export type ActionsTypes = 'reply' | 'command';

/**
 * For use to bind email profile and telegram user
 */
export class BindTelegramToEmailDTO {
  readonly tgChatId!: string;
  readonly tgUserId!: string;
  readonly username!: string;
  readonly firstName!: string;
  readonly lastName!: string;
}
