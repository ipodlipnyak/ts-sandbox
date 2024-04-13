import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RestResponseDto } from './rest-response.dto';
import { Field, InputType, ObjectType, ID, Float, Extensions } from '@nestjs/graphql';

export class GoogleInitDto {
  @ApiProperty({
    example: 'https://accounts.google.com1234567890-abc123def456.apps.googleusercontent.com',
    description: 'Google web client Id',
  })
  clientId: string;
}

export class GoogleInitReponseDto extends RestResponseDto {
  @ApiProperty({ type: GoogleInitDto, isArray: false, description: 'Google init response' })
  payload: GoogleInitDto;
}

export class JWTInputDto {
  @IsString()
  @ApiProperty({ example: '1haWwuY29tIi...GTdHbV2', description: 'Very long token' })
  @Transform(({ value }) => value.trim())
  readonly credential: string;
}

/**
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference#credential
 */
export class GoogleUserInfoDto {
  @ApiProperty({ example: 'https://accounts.google.com', description: 'The JWT`s issuer' })
  iss: string;
  @ApiProperty({ example: '161803398874', description: 'nbf' })
  nbf: number;
  @ApiProperty({ example: '314159265-pi.apps.googleusercontent.com', description: 'Your server`s client ID' })
  aud: string;
  @ApiProperty({ example: '3141592653589793238', description: 'The unique ID of the user`s Google Account' })
  sub: string;
  @ApiProperty({ example: 'elisa.g.beckett@gmail.com', description: 'The user`s email address' })
  email: string;
  @ApiProperty({ example: true, description: 'true, if Google has verified the email address' })
  email_verified: boolean;
  @ApiProperty({ example: '314159265-pi.apps.googleusercontent.com' })
  azp: string;
  @ApiProperty({ example: 'Elisa Beckett' })
  name: string;
  @ApiProperty({
    example: 'https://lh3.googleusercontent.com/a-/e2718281828459045235360uler',
    description: 'If present, a URL to user`s profile picture',
  })
  picture: string;
  @ApiProperty({ example: 'Elisa' })
  given_name: string;
  @ApiProperty({ example: 'Beckett' })
  family_name: string;
  @ApiProperty({ example: 1596474000, description: 'Unix timestamp of the assertion`s creation time' })
  iat: number;
  @ApiProperty({ example: 1596477600, description: 'Unix timestamp of the assertion`s expiration time' })
  exp: number;
  @ApiProperty({ example: 'abc161803398874def' })
  jti: string;
}

@ObjectType()
export class GoogleDateDto {
  @Field({ nullable: true })
  @ApiProperty({ example: '2015-05-28T09:00:00-07:00' })
  dateTime: string;
  @Field({ nullable: true })
  @ApiProperty({ example: 'America/Los_Angeles' })
  timeZone: string;
}

export class GoogleAttendeesDto {
  @ApiProperty({ example: 'lpage@example.com' })
  email: string;
}

/**
 * @see https://developers.google.com/calendar/api/v3/reference/events/insert#examples
 * @see https://developers.google.com/calendar/api/v3/reference/events#resource-representations
 */
@ObjectType()
export class GoogleCalendarEventDto {
  @ApiProperty({ example: '12345blah@@group.calendar.google.com' })
  @Field({ nullable: true })
  calendarId: string;
  @ApiProperty({ example: 'Google I/O 2015' })
  @Field({ nullable: true })
  summary: string;
  @ApiProperty({ example: '800 Howard St., San Francisco, CA 94103' })
  @Field({ nullable: true })
  location: string;
  @ApiProperty({ example: 'A chance to hear more about Google\'s developer products.' })
  @Field({ nullable: true })
  description: string;
  @ApiProperty({ type: GoogleDateDto, isArray: false, description: 'The (inclusive) start time of the event. For a recurring event, this is the start time of the first instance' })
  @Field({ nullable: true })
  start: GoogleDateDto;
  @ApiProperty({ type: GoogleDateDto, isArray: false, description: 'The (exclusive) end time of the event. For a recurring event, this is the end time of the first instance.' })
  @Field({ nullable: true })
  end: GoogleDateDto;
  @ApiProperty({ type: GoogleAttendeesDto, isArray: true, description: 'The attendees of the event' })
  attendees: GoogleAttendeesDto[];
}

/**
 * @see https://developers.google.com/calendar/api/v3/reference/calendars#resource
 */
@ObjectType()
export class GoogleCalendarDto {
  @ApiProperty({ example: 'calendarSummary', description: 'Title of the calendar' })
  @Field({ nullable: true })
  summary: string;
  @ApiProperty({
    example: 'America/Los_Angeles',
    description: 'The time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".) Optional.',
    required: false,
  })
  @Field({ nullable: true })
  timeZone?: string;
}

export class GoogleCalendarAclScopeDto {
  @ApiProperty({ example: 'user', description: 'The type of the scope' })
  type: string;
  @ApiProperty({ example: 'someuser@gmail.com', description: 'The email address of a user or group, or the name of a domain, depending on the scope type' })
  value: string;
}

export class GoogleCalendarAclDto {
  @ApiProperty({ example: 'owner', description: 'The role assigned to the scope' })
  role: string;
  @ApiProperty({ type: GoogleCalendarAclScopeDto, isArray: false, description: 'Acl scope' })
  scope: GoogleCalendarAclScopeDto;
}
