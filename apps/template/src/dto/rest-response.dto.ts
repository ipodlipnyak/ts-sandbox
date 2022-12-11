import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ResponseStatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class RestResponseDto {
  @IsString()
  @ApiProperty({ example: ResponseStatusEnum.SUCCESS, description: 'Статус запроса' })
  status: ResponseStatusEnum;
  payload?: any;
}

export class RestListResponseDto extends RestResponseDto {
  @ApiProperty({ example: 1, description: 'Общее количество доступных элементов' })
  total: number;
  @ApiProperty({ example: 0, description: 'Смещение элементов' })
  offset: number;
  @ApiProperty({ example: 1, description: 'Максимальное количество элементов в ответе' })
  limit: number;
  payload?: any[];
}
