import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RestListResponseDto, RestResponseDto } from './rest-response.dto';
import { BalanceDto } from './balance.dto';
import { TrackItemDto } from './track.dto';
import { Transform } from 'class-transformer';
import { Field, ObjectType, InputType, ID} from 'type-graphql';

@ObjectType()
export class UserOutputDto {
  @Field(type => ID)
  id?: string;
  @Field()
  firstName: string;
  @Field()
  middleName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
}

@InputType()
export class UserInputDto {
  @Field()
  firstName: string;
  @Field()
  middleName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
}

export class UserPublicDto {
  @ApiProperty({ example: 'John', description: 'Имя' })
  firstName: string;
  @ApiProperty({ example: 'Mc', description: 'Отчество' })
  middleName: string;
  @ApiProperty({ example: 'Goofin', description: 'Фамилия' })
  lastName: string;
  @ApiProperty({ description: 'Трэк' })
  track?: TrackItemDto;
}

export class UserCachedDto extends UserPublicDto {
  @ApiProperty({ example: 123, description: 'Идентификатор пользователя' })
  id: number;
}

export class UserDto extends UserCachedDto {
  @ApiProperty({ example: '-9', description: 'Последняя дельта' })
  lastDelta: number;
  @ApiProperty({ example: '100', description: 'Сумма всех баллов' })
  total: number;
  @ApiProperty({ type: BalanceDto, isArray: true, description: 'История тарзакций' })
  balance: BalanceDto[];
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  email: string;
  @ApiProperty({ example: '-200', description: 'Дельта к начислению' })
  delta: string | number;
}

export class UsesListResponseDto extends RestListResponseDto {
  @ApiProperty({ type: UserDto, isArray: true, description: 'Список пользователей и их баллов' })
  payload: UserDto[];
}

export class UserResponseDto extends RestResponseDto {
  @ApiProperty({ type: UserDto, isArray: false, description: 'Данные пользователя' })
  payload: UserDto;
}

export class NewUserDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly email: string;

  @ApiProperty({ example: 'John', description: 'Имя' })
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly firstName: string;

  @ApiProperty({ example: 'Mc', description: 'Отчество' })
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly middleName: string;

  @ApiProperty({ example: 'Goofin', description: 'Фамилия' })
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly lastName: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  readonly password: string;

  @ApiProperty({ example: 1, description: 'Идентификатор трэка' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly trackId: number;
}
