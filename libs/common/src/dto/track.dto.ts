import { RestListResponseDto } from './rest-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TrackItemDto {
  @ApiProperty({ example: 123, description: 'Идентификатор' })
  id: number;
  @ApiProperty({ example: 'Туризм', description: 'Имя трэка' })
  name: string;
}

export class TrackReponseDto extends RestListResponseDto {
  @ApiProperty({ type: TrackItemDto, isArray: true, description: 'Список трэков' })
  payload: TrackItemDto[];
}
