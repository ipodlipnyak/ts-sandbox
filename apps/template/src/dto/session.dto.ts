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
  is_admin?: boolean;
  is_user?: boolean;
}

export class WhoAmIDto {
  @ApiProperty({
    example: 42,
    description: 'Идентификатор пользователя',
  })
  id: number;
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
