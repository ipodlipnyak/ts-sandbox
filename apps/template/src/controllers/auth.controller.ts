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
import { ApiOperation, ApiResponse, ApiSecurity, ApiBadRequestResponse } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestResponseDto,
  LoginDto,
  WhoAmIResponseDto,
  ScoreReponseDto,
  ScoreDto,
  NewUserDto,
} from '../dto';
import { Users, USER_EMAIL_EXIST_EXCEPTION, NewUserDataError } from './../models';
import { AuthGuard } from './../guards';
import { UserService, RatingService } from './../services';
import { OAuth2Client } from 'google-auth-library';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
    private readonly ratingService: RatingService,
  ) { }

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @ApiBadRequestResponse({
    schema: {
      oneOf: [
        {
          description: 'Already logged in',
        },
        {
          description: 'Email required',
        },
        {
          description: 'Password required',
        },
        {
          description: 'Email already exist',
        },
        {
          description: 'Bad data',
        },
      ],
    },
  })
  async signup(
    @Body() newUserDto: NewUserDto,
    @Session() session: Record<string, any>,
  ): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    if (this.userService?.userId) {
      throw new HttpException('Already logged in', HttpStatus.BAD_REQUEST);
    }

    const email = newUserDto?.email;
    if (!email) {
      throw new HttpException('Email required', HttpStatus.BAD_REQUEST);
    }
    const password = newUserDto?.password;
    if (!password) {
      throw new HttpException('Password required', HttpStatus.BAD_REQUEST);
    }

    let user: Users;
    try {
      user = await Users.createUser(newUserDto);
    } catch (error) {
      switch (error.name) {
        case USER_EMAIL_EXIST_EXCEPTION.name:
          throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
        case NewUserDataError.name:
          throw new HttpException(error?.message || 'Bad data', HttpStatus.BAD_REQUEST);
        default:
          throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    if (user) {
      result.status = ResponseStatusEnum.SUCCESS;
      const whoami = { ...user };
      delete whoami.password;
      session.whoami = whoami;
    }

    await this.ratingService.cleanBoardCache();

    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  async auth(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const email = loginDto?.login;
    if (!email) {
      throw new HttpException('Login required', HttpStatus.BAD_REQUEST);
    }

    const user = await Users.findOne({
      where: { email },
      select: [
        'id',
        'password',
        'active',
      ],
    });
    /**
     * Can not login by this strategy without password.
     * Probably this user was using google authentication.
     * He should go and set a password in his profile settings.
     * Also should not show an inactive user... probably
     *  */ 
    if (!user || !user.active || !user.password) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const password = loginDto?.password || '';
    const verified = await user.passwordVerify(password);
    if (!verified) {
      throw new HttpException('Incorrect or missing credentials', HttpStatus.FORBIDDEN);
    }

    const isLoggedIn = await this.userService.loginByEmail(email);
    if (isLoggedIn) {
      result.status = ResponseStatusEnum.SUCCESS;
    }

    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Разлогиниться' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  async logout(@Session() session: Record<string, any>): Promise<RestResponseDto> {
    session.destroy();
    /*
    session.access_token = null;
    session.refresh_token = null;
    */
    return { status: ResponseStatusEnum.SUCCESS };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Мой баланс' })
  @ApiResponse({ status: 200, type: ScoreReponseDto })
  @ApiSecurity('user')
  @Get('balance')
  async myBalance(): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const user = await this.userService.getUser();

    const payload: ScoreDto = {
      score: user?.calcScore() || 0,
      total: user?.calcTotal() || 0,
      rating: await this.userService.getRating(),
    };
    result.payload = payload;
    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Who am I' })
  @ApiResponse({ status: 200, type: WhoAmIResponseDto })
  @ApiSecurity('user')
  @ApiSecurity('admin')
  whoAmI(@Session() session: Record<string, any>): WhoAmIResponseDto {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };
    let whoami = session?.whoami;

    if (!whoami && session?.is_admin) {
      whoami = {
        email: 'no@reply.com',
      };
    }

    if (whoami) {
      result.status = ResponseStatusEnum.SUCCESS;
      result.payload = whoami;
    }

    return result;
  }
}
