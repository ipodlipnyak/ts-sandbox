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
  GoogleInitReponseDto,
  JWTInputDto,
} from '../dto';
import { AuthGuard } from './../guards';
import { GoogleService } from '@my/google';

@Controller('google')
export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
  ) { }

  @ApiOperation({ summary: 'Google client info required to initiate connection' })
  @ApiResponse({ status: 200, type: GoogleInitReponseDto })
  @ApiInternalServerErrorResponse({
    schema: {
      oneOf: [
        {
          description: 'Missing client Id',
        },
      ],
    },
  })
  @Get('')
  async clientInit(): Promise<GoogleInitReponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    console.log(this.configService.get('google'));
    const clientId = this.googleService.ClientId;

    if (!clientId) {
      throw new HttpException('Missing client Id', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    result.payload = {
      clientId,
    }

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  /**
   * Validate the JWT credential sent from client-side
   * 
   * @param input 
   * @param session 
   */
  @ApiOperation({ summary: 'Validate the JWT credential sent from client-side' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @Post('jwt')
  async jwt(
    @Body() input: JWTInputDto,
    @Session() session: Record<string, any>,
  ): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const client = this.googleService.ClientInstance;
    const credential = input.credential;
    const ticket = await client.verifyIdToken({
      idToken: credential,
    });
    const payload = ticket.getPayload();
    result.payload = payload;
    session.google_user_info = payload;

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
