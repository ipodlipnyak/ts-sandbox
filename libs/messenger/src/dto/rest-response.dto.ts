import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ResponseStatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class RestResponseDto {
  @IsString()
  @ApiProperty({ example: ResponseStatusEnum.SUCCESS, description: 'Response status' })
  status: ResponseStatusEnum;
  payload?: any;
}

export class RestListResponseDto extends RestResponseDto {
  @ApiProperty({ example: 1, description: 'Total amount' })
  total: number;
  @ApiProperty({ example: 0, description: 'Query offset' })
  offset: number;
  @ApiProperty({ example: 1, description: 'Limit per page' })
  limit: number;
  payload?: any[];
}
