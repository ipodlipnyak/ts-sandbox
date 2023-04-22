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
import { LLMService } from '@my/llm';
import { GPTApiRequestDTO } from '@my/llm';

@Controller('llm')
export class LLMController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private llmService: LLMService,
  ) { }

  @ApiOperation({ summary: 'Ask anything to llm' })
  @ApiResponse({ status: 200, type: LLMQueryReponseDto })
  @ApiSecurity('user')
  @ApiSecurity('admin')
  @Post('query')
  @UseGuards(AuthGuard)
  async query(
    @Body() input: GPTApiRequestDTO,
    @Session() session: Record<string, any>,
  ): Promise<LLMQueryReponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };
    const response = await this.llmService.query(input);

    if (response) {
      result.status = ResponseStatusEnum.SUCCESS;
      result.payload = response;
    }

    return result;
  }
}
