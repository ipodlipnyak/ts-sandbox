import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AddScoreDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: '15', description: 'Дельта к начислению' })
  @Transform(({ value }) => parseInt(value))
  delta: string | number;
}

export class AdminLoginDto {
  @ApiProperty({ example: 'somePass_#123', description: 'Пароль' })
  password: string;
}
