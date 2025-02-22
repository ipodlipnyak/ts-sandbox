import { ApiProperty } from '@nestjs/swagger';
import { RestListResponseDto, RestResponseDto } from '@my/common';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
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

export class TelegramUsersOutputDto {
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
  @ApiProperty({ type: TelegramUsersOutputDto, isArray: true, description: 'Telegram users list' })
  payload: TelegramUsersOutputDto[];
}

export class TelegramBindInputDto {
  @IsString()
  @ApiProperty({ example: '1haWwuY29tIi...GTdHbV2', description: 'Very long token' })
  @Transform(({ value }) => value.trim())
  readonly token: string;
}

