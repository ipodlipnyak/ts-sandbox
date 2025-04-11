import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
  Body,
  HttpStatus,
  HttpException,
  Logger,
  Ip,
  Req,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestResponseDto,
  JWTInputDto,
  MinecraftStatusReponseDto,
  MinecraftPlayerDto,
  MinecraftInputDto,
} from '@my/common/dto';
import { AuthGuard } from '@my/common/guards';
import { GoogleService } from '@my/google';
import { UsersService } from '@my/users';
import { UserService } from '@my/common/services';
import { CloudflareService } from '@my/cloudflare';

@Controller('minecraft')
export class MinecraftController {
  private readonly logger = new Logger(MinecraftController.name);
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
    private userService: UserService,
    private cloudflareService: CloudflareService,
  ) { }


  @UseGuards(AuthGuard)
  @ApiSecurity('user')
  @ApiOperation({ summary: 'Get server status' })
  @ApiResponse({ status: 200, type: MinecraftStatusReponseDto })
  @Get('')
  async getSrvStatus(
    @Query() query: MinecraftInputDto,
    @Session() session: Record<string, any>,
  ): Promise<MinecraftStatusReponseDto> {
    let result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    try {
      const ip = query.ip || this.cloudflareService.getVisitorIp();
      const email = (await this.userService.getUser()).email;
      const data: MinecraftPlayerDto = {
        email,
        ip,
      };

      const url = this.configService.get('minecraft.statusUrl');
      const response = await this.googleService.invokeGCFunction(url, data);
      result = response as MinecraftStatusReponseDto;
      result.payload.userIp = ip;
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
    @Body() body: MinecraftInputDto,
    @Session() session: Record<string, any>,
    @Ip() ip: string,
    @Req() request,
  ): Promise<MinecraftStatusReponseDto> {
    let result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    try {
      const ip = body.ip || this.cloudflareService.getVisitorIp();
      const email = (await this.userService.getUser()).email;
      const data: MinecraftPlayerDto = {
        email,
        ip,
      };

      const url = this.configService.get('minecraft.startUrl');
      const response = await this.googleService.invokeGCFunction(url, data);
      result = response as MinecraftStatusReponseDto;
      result.payload.userIp = ip;
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
    @Body() body: MinecraftInputDto,
    @Session() session: Record<string, any>,
    @Ip() ip: string
  ): Promise<MinecraftStatusReponseDto> {
    let result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    try {
      const ip = body.ip || this.cloudflareService.getVisitorIp();
      const email = (await this.userService.getUser()).email;
      const data: MinecraftPlayerDto = {
        email,
        ip,
      };

      const url = this.configService.get('minecraft.stopUrl');
      const response = await this.googleService.invokeGCFunction(url, data);
      result = response as MinecraftStatusReponseDto;
      result.payload.userIp = ip;
    } catch (error) {
      this.logger.error(error);
    }

    return result;
  }

}
