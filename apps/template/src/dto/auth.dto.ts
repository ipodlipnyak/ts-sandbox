import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RestResponseDto } from './rest-response.dto';
import { MyRatingItemDto } from './rating.dto';
import { Transform } from 'class-transformer';

export class OAuth2ResponseDto {
  @IsString()
  @ApiProperty({ example: '1haWwuY29tIi...GTdHbV2', description: 'Very long token' })
  @Transform(({ value }) => value.trim())
  readonly credential: string;
}

export class LoginDto {
  @IsString()
  @ApiProperty({ example: 'some@email.com', description: 'Email используется как логин' })
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly login: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  readonly password: string;
}

export class ScoreDto {
  @ApiProperty({ example: 1000, description: 'Всего баллов' })
  total: number;
  @ApiProperty({ example: 500, description: 'Баллов рейтинга' })
  score: number;
  @ApiProperty({ description: 'Места в рейтинге' })
  rating: MyRatingItemDto[];
}

export class ScoreReponseDto extends RestResponseDto {
  @ApiProperty({ type: ScoreDto, isArray: false, description: 'Статистика баллов' })
  payload: ScoreDto;
}
