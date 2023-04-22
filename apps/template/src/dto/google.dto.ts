import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RestResponseDto } from './rest-response.dto';

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
