import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseStatusEnum, RestListResponseDto, TrackReponseDto } from '../dto';
import { Track } from './../models';

@Controller('tracks')
export class TrackController {
  @ApiOperation({ summary: 'Трэки' })
  @ApiResponse({ status: 200, type: TrackReponseDto })
  @Get()
  async getAll(): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      total: 0,
      offset: 0,
      limit: 0,
      payload: undefined,
    };

    result.payload = await Track.find();
    result.total = result.payload.length;
    result.limit = result.payload.length;
    result.status = ResponseStatusEnum.SUCCESS;

    return result;
  }
}
