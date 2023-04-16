import { ApiProperty } from '@nestjs/swagger';
import { RestResponseDto } from './rest-response.dto';
// import { Type } from 'class-transformer';
/**
 * @see https://lunar-eclipse-685968.postman.co/workspace/Lera--%3E-RedCross~19b1647d-a111-4fc0-9eb6-2d989177b38d/request/7659682-6a858608-3406-4584-a26b-03f4ec59b804
 */
export class SessionDto {
  access_token?: string;
  refresh_token?: string;
  whoami?: WhoAmIDto;
  google_user_info?: GoogleUserInfo;
}

export class WhoAmIDto {
  @ApiProperty({
    example: '652d04a6-aee8-4a6c-b116-ace3b6667b5a',
    description: 'Идентификатор пользователя',
  })
  id: string;
  @ApiProperty({ example: 100, description: 'Role' })
  role: number;
  @ApiProperty({ example: 'Иван', description: 'Имя' })
  firstName: string;
  @ApiProperty({ example: 'Сидоров', description: 'Фамилия' })
  middleName: string;
  @ApiProperty({ example: 'Сидоров', description: 'Фамилия' })
  lastName: string;
  @ApiProperty({
    example: 'some@email.com',
    description: 'Email используется как логин',
  })
  email: string;
}

export class WhoAmIResponseDto extends RestResponseDto {
  @ApiProperty({ description: 'Данные пользователя' })
  payload: WhoAmIDto;
}

/**
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference#credential
 */
export class GoogleUserInfo {
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
