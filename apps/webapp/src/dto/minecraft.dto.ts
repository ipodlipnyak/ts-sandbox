import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RestResponseDto } from './rest-response.dto';

export class MinecraftPlayerDto {
  @ApiProperty({
    example: 'email@dot.com',
    description: 'Players email',
  })
  email: string;
  @ApiProperty({
    example: '123.123.123.123',
    description: 'Players ip',
  })
  ip: string;
}

export class MinecraftStatusDto {
  @ApiProperty({
    example: 'mc',
    description: 'Server name',
  })
  name: string;
  @ApiProperty({
    example: 'TERMINATED',
    description: 'Server status. TERMINATED or RUNNING',
  })
  status: string;
  @ApiProperty({
    example: '123.123.213.321',
    description: 'External ip to connect to. Empty when server terminated',
  })
  externalIp: string;
  @ApiProperty({
    example: 'false',
    description: 'Do player allowed to connect to server',
  })
  isPlayerHaveAccess: boolean;
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