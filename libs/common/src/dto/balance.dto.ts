import { ApiProperty } from '@nestjs/swagger';
import { RestListResponseDto } from './rest-response.dto';
import { Transform } from 'class-transformer';

export class BalanceImportDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;
  @ApiProperty({ example: '-200', description: 'Дельта к начислению' })
  delta: string | number;
}

export class BalanceDto {
  @ApiProperty({ example: 123, description: 'Идентификатор транзакции' })
  id: number;
  @ApiProperty({ example: -200, description: 'Идентификатор транзакции' })
  value: number;
  @ApiProperty({ example: 200, description: 'Код транзакции' })
  code: number;
  @ApiProperty({ example: '2022-07-27T10:10:22.561Z', description: 'Время создания записи' })
  created: string;
  @ApiProperty({ example: '2022-07-27T10:10:22.561Z', description: 'Время обновления записи' })
  updated: string;
}

export class BalanceResponseDto extends RestListResponseDto {
  @ApiProperty({ type: BalanceDto, isArray: true, description: 'История тарзакций' })
  payload: BalanceDto[];
}
