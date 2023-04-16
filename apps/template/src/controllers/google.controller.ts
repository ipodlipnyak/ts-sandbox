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
  OAuth2ResponseDto,
  GoogleInitReponseDto,
} from '../dto';
import { Users, USER_EMAIL_EXIST_EXCEPTION, NewUserDataError } from './../models';
import { AuthGuard } from './../guards';
import { UserService, RatingService } from './../services';
import { OAuth2Client } from 'google-auth-library';
import { GoogleService } from '@my/google';

@Controller('google')
export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
    private readonly userService: UserService,
    private readonly ratingService: RatingService,
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
   * @param googleResponse 
   * @param session 
   */
  @ApiOperation({ summary: 'Validate the JWT credential sent from client-side' })
  @ApiResponse({ status: 200, type: RestResponseDto})
  @Post('jwt')
  async jwt(
    @Body() googleResponse: OAuth2ResponseDto,
    @Session() session: Record<string, any>,
  ): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const client = new OAuth2Client(this.configService.get('google.clientID'));
    const credential = googleResponse.credential;
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
