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
  AuthTokenInputDto,
  GoogleUserInfoDto,
} from '../dto';
import { AuthGuard } from './../guards';
import { GoogleService } from '@my/google';
import { UsersService } from '@my/users';
import { UserService } from '../services';

@Controller('google')
export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private configService: ConfigService,
    private userService: UserService,
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
  @ApiOperation({ summary: 'Validate the JWT credential sent from client-side and login' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @ApiBadRequestResponse({
    schema: {
      oneOf: [
        {
          description: 'This email is not authorised to login',
        },
      ],
    },
  })
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
    session.google_user_info = payload;

    const isLoggedIn = await this.userService.loginByEmail(payload.email);
    const user = await this.userService.getUser();

    // update user name
    let isdirty = false;
    if (!user.firstName) {
      user.firstName = payload.given_name;
      isdirty = true;
    }
    if (!user.lastName) {
      user.lastName = payload.family_name;
      isdirty = true;
    }
    if (user.pictureUrl !== payload.picture) {
      user.pictureUrl = payload.picture;
      isdirty = true;
    }
    if (isdirty) {
      user.save();
    }

    if (!isLoggedIn) {
      throw new HttpException('This email is not authorised to login', HttpStatus.BAD_REQUEST);
    }

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  /**
   * Validate the acess token sent from client-side
   *
   * @see https://developers.google.com/identity/oauth2/web/guides/use-token-model
   * @param input
   * @param session
   */
  @ApiOperation({ summary: 'Validate the access token sent from client-side and login' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @ApiBadRequestResponse({
    schema: {
      oneOf: [
        {
          description: 'This email is not authorised to login',
        },
      ],
    },
  })
  @Post('token')
  async accessToken(
    @Body() input: AuthTokenInputDto,
    @Session() session: Record<string, any>,
  ): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const client = this.googleService.ClientInstance;

    const { accessToken } = input;

    /**
     * @see https://developers.google.com/identity/oauth2/web/guides/use-code-model#auth_code_handling
     */
    // const { tokens } = await client.getToken(code);
    // client.setCredentials({ access_token: tokens.access_token })

    client.setCredentials({ access_token: accessToken });
    const pyaload = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    const userInfo = pyaload.data as GoogleUserInfoDto;

    session.google_user_info = userInfo;

    const isLoggedIn = await this.userService.loginByEmail(userInfo.email);
    const user = await this.userService.getUser();

    // update user name
    let isdirty = false;
    if (!user.firstName) {
      user.firstName = userInfo.given_name;
      isdirty = true;
    }
    if (!user.lastName) {
      user.lastName = userInfo.family_name;
      isdirty = true;
    }
    if (user.pictureUrl !== userInfo.picture) {
      user.pictureUrl = userInfo.picture;
      isdirty = true;
    }
    if (isdirty) {
      user.save();
    }

    if (!isLoggedIn) {
      throw new HttpException('This email is not authorised to login', HttpStatus.BAD_REQUEST);
    }

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
