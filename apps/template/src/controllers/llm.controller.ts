import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
  Body,
  // Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestResponseDto,
  JWTInputDto,
  LLMQueryReponseDto,
} from '../dto';
import { AuthGuard } from './../guards';
import { UsersService } from '@my/users';
import { UserService } from '../services';

@Controller('llm')
export class LLMController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) { }

  @ApiOperation({ summary: 'Google client info required to initiate connection' })
  @ApiResponse({ status: 200, type: LLMQueryReponseDto })
  @ApiInternalServerErrorResponse({
    schema: {
      oneOf: [
        {
          description: 'Missing client Id',
        },
      ],
    },
  })
  @ApiSecurity('user')
  @ApiSecurity('admin')
  @Post('query')
  @UseGuards(AuthGuard)
  async query(): Promise<LLMQueryReponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };


    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
