import { ApiProperty } from "@nestjs/swagger";
import { RestListResponseDto } from "./rest-response.dto";

export class TelegramChatDto {
  @ApiProperty({ example: '1111111' })
  id: string;
  @ApiProperty({ example: 'Testusername' })
  username: string;
  @ApiProperty({ example: 'Test Lastname' })
  last_name: string;
  @ApiProperty({ example: 'Test Firstname' })
  first_name: string;
  @ApiProperty({ example: 'private' })
  type: string;
}

export class TelegramUserDto {
  @ApiProperty({ example: '1111111' })
  id: string;
  @ApiProperty({ example: 'Testusername' })
  username: string;
  @ApiProperty({ example: 'Test Lastname' })
  last_name: string;
  @ApiProperty({ example: 'Test Firstname' })
  first_name: string;
}

export class TelegramMessageDto {
  @ApiProperty({ example: '1441645532', description: 'Unicode time stamp' })
  date: string;
  @ApiProperty({ example: '1365', description: 'Message id' })
  message_id: string;
  @ApiProperty({ example: '/start', description: 'Message text content' })
  text: string;
  @ApiProperty({ description: 'Who is sending message' })
  from: TelegramUserDto;
  @ApiProperty({ description: 'Which chat' })
  chat: TelegramChatDto;
}

export class TelegramEventMessageInputDto {
  @ApiProperty({ example: '10000', description: '' })
  update_id: string;
  @ApiProperty({ description: 'Incoming message' })
  message: TelegramMessageDto;
}

export class MessageDto {
  @ApiProperty({ example: '10000', description: '' })
  id: string;
  @ApiProperty({ description: 'Incoming message' })
  text: string;
  @ApiProperty({ example: '10000', description: 'Chat id' })
  chat_id: string;
}

export class MessagesListResponseDto extends RestListResponseDto {
  @ApiProperty({ type: MessageDto, isArray: true, description: 'List of recieved messages' })
  payload: MessageDto[];
}
