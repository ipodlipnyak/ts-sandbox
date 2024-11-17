import { Controller, Get } from '@nestjs/common';
import { ResponseStatusEnum, RestResponseDto } from '../dto';

@Controller()
export class AppController {
  @Get()
  getHello(): RestResponseDto {
    return {
      status: ResponseStatusEnum.SUCCESS,
    };
  }
}
