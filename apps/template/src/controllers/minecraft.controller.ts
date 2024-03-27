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
  @ApiOperation({ summary: 'Get server status' })
  @ApiResponse({ status: 200, type: MinecraftStatusReponseDto })
  @Get('')
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

      const url = this.configService.get('minecraft.statusUrl');
      const response = await this.googleService.invokeGCFunction(url, data);
      result = response as MinecraftStatusReponseDto;
    } catch (error) {
      this.logger.error(error);
    }

    return result;
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Start server' })
  @ApiResponse({ status: 200, type: MinecraftStatusReponseDto })
  @Post('start')
  async startSrv(
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

      const url = this.configService.get('minecraft.startUrl');
      debugger
      const response = await this.googleService.invokeGCFunction(url, data);
      result = response as MinecraftStatusReponseDto;
    } catch (error) {
      this.logger.error(error);
    }

    return result;
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Stop server' })
  @ApiResponse({ status: 200, type: MinecraftStatusReponseDto })
  @Post('stop')
  async stopSrv(
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

      const url = this.configService.get('minecraft.stopUrl');
      const response = await this.googleService.invokeGCFunction(url, data);
      result = response as MinecraftStatusReponseDto;
    } catch (error) {
      this.logger.error(error);
    }

    return result;
  }

}
