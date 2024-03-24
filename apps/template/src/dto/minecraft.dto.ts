import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RestResponseDto } from './rest-response.dto';

export class MinecraftStatusDto {
  @ApiProperty({
    example: 'mc',
    description: 'Server name',
  })
  name: string;
  @ApiProperty({
    example: 'TERMINATED',
    description: 'Sever status',
  })
  status: string;
  @ApiProperty({
    example: '2024-03-17T10:16:12.040-07:00',
    description: 'Last time server start',
  })
  lastStartTimestamp: string;
  @ApiProperty({
    example: '2024-03-17T10:16:12.040-07:00',
    description: 'Last time server stop',
  })
  lastStopTimestamp: string;
}

export class MinecraftStatusReponseDto extends RestResponseDto {
  @ApiProperty({ type: MinecraftStatusDto, isArray: false, description: 'Minecraft server status' })
  payload: MinecraftStatusDto;
}