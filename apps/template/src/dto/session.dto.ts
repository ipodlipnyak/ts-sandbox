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
