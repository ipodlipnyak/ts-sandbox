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
  Logger,
  Ip,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestResponseDto,
  JWTInputDto,
  MinecraftStatusReponseDto,
  MinecraftPlayerDto,
} from '../dto';
import { AuthGuard } from './../guards';
import { GoogleService } from '@my/google';
import { UsersService } from '@my/users';
import { UserService } from '../services';

@Controller('minecraft')
export class MinecraftController {
  private readonly logger = new Logger(MinecraftController.name);
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
    private userService: UserService,
  ) { }

  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Google client info required to initiate connection' })
  @ApiResponse({ status: 200, type: MinecraftStatusReponseDto })
  @Post('')
  async getSrvStatus(
    @Session() session: Record<string, any>,
    @Ip() ip
  ): Promise<MinecraftStatusReponseDto> {
    let result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    try {
      const email = (await this.userService.getUser()).email;
      const data: MinecraftPlayerDto = {
        email,
        ip
      };

      const statusUrl = this.configService.get('minecraft.statusUrl');
      const response = await this.googleService.invokeGCFunction(statusUrl, data);
      result = response as MinecraftStatusReponseDto;
    } catch (error) {
      this.logger.error(error);
    }

    return result;
  }

}
