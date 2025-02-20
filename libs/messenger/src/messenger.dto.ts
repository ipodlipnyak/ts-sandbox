import { ApiProperty } from '@nestjs/swagger';
import { RestListResponseDto } from '@my/common';
// import { Field, ID } from '@nestjs/graphql';

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

export class TelegramUsersFormattedResponseDto {
  // @Field(type => ID)
  @ApiProperty({ example: '123', description: 'User to telegram chat relation id' })
  id: string
  // @Field({ nullable: true })
  @ApiProperty({ example: '123', description: 'Telegram user id' })
  tgUserId: string;
  // @Field({ nullable: true })
  @ApiProperty({ example: '123', description: 'Telegram chat id' })
  tgChatId: string;
  // @Field({ nullable: true })
  @ApiProperty({ example: 'Gavin', description: 'First name as in telegram' })
  firstName: string;
  // @Field({ nullable: true })
  @ApiProperty({ example: 'McBurger', description: 'Last name as in telegram' })
  lastName: string;
  // @Field({ nullable: true })
  @ApiProperty({ example: '@McBurger', description: 'Username as in telegram' })
  username: string;
}

export class TelegramUsersListResponseDto extends RestListResponseDto {
  @ApiProperty({ type: TelegramUsersFormattedResponseDto, isArray: true, description: 'Telegram users list' })
  payload: TelegramUsersFormattedResponseDto[];
}
