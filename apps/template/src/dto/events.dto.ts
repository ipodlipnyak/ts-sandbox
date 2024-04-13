import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RestListResponseDto, RestResponseDto } from './rest-response.dto';
import { UserNameDto } from './user.dto';
import { GoogleCalendarDto, GoogleCalendarEventDto } from './google.dto';
import { Field, InputType, ObjectType, ID, Float, Extensions } from '@nestjs/graphql';

export class CalendarAclDto extends UserNameDto {
  @ApiProperty({ example: 'owner', description: 'The role assigned to the scope' })
  email: string;
  @ApiProperty({ example: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png', description: 'User picture' })
  pictureUrl: string;
}

export class CalendarAclListResponseDto extends RestListResponseDto {
    @ApiProperty({ type: CalendarAclDto, isArray: true, description: 'Acl list for specific calendar' })
    payload: CalendarAclDto[];
}

@ObjectType()
export class EventDto extends GoogleCalendarEventDto {
  @Field()
  calendar: GoogleCalendarDto;
}
