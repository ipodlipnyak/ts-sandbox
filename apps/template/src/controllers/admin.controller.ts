import { ConfigService } from '@nestjs/config';
import { RatingService } from './../services';
import {
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  BalanceImportDto,
  RestResponseDto,
  RestListResponseDto,
  AdminLoginDto,
  UsesListResponseDto,
  UserResponseDto,
  AddScoreDto,
} from '../dto';
import { AdminGuard } from './../guards';
import { Users } from './../models';

@Controller('admin')
export class AdminController {
  constructor(
    private configService: ConfigService, // private readonly userService: UserService,
    private ratingService: RatingService,
  ) {
    //
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Закинуть баллы пользователю' })
  @Post('add-score')
  async addScore(@Body() addScoreDto: AddScoreDto): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    let user = await Users.findOne({
      where: {
        email: addScoreDto.email,
      },
    });

    if (!user) {
      user = new Users();
      user.email = addScoreDto.email;
      await user.save();
      await user.reload();
      // throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await user.addScoreDelta(Number(addScoreDto.delta));
    await this.ratingService.cleanBoardCache();

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }

  // @ApiOperation({ summary: 'Залогиниться как админ' })
  // @Post('login')
  // auth(
  //   @Body() adminLoginDto: AdminLoginDto,
  //   @Session() session: Record<string, any>,
  // ): RestResponseDto {
  //   const result = {
  //     status: ResponseStatusEnum.ERROR,
  //     payload: undefined,
  //   };

  //   if (adminLoginDto.password === this.configService.get('sessions.adminPassword')) {
  //     result.status = ResponseStatusEnum.SUCCESS;
  //     session.is_admin = true;
  //   }

  //   return result;
  // }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Проверка авторизован ли админ' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @ApiSecurity('admin')
  @Get()
  isAdmin(): RestResponseDto {
    return {
      status: ResponseStatusEnum.SUCCESS,
      payload: 'admin rights granted',
    };
  }

  // @UseGuards(AdminGuard)
  // @ApiOperation({ summary: 'Загрузить список дельт пользователей' })
  // @ApiResponse({ status: 200, type: RestResponseDto })
  // @ApiSecurity('admin')
  // @ApiBody({ type: BalanceImportDto, isArray: true })
  // @Post('/balance')
  // async saveBalance(@Body() balance: BalanceImportDto[]): Promise<RestResponseDto> {
  //   const result: RestResponseDto = {
  //     status: ResponseStatusEnum.ERROR,
  //     payload: undefined,
  //   };
  //   await Users.importBalance(balance);
  //   await this.ratingService.cleanBoardCache();
  //   result.status = ResponseStatusEnum.SUCCESS;
  //   return result;
  // }

  /*
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Получить список пользователей с балансами' })
  @ApiResponse({ status: 200, type: UsesListResponseDto, isArray: true })
  @ApiSecurity('admin')
  @Get('/balance')
  async getBalance(): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    result.payload = await Users.exportBalance();

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
*/

  // @UseGuards(AdminGuard)
  // @ApiOperation({ summary: 'Получить данные для одного пользователя' })
  // @ApiResponse({ status: 200, type: UserResponseDto })
  // @ApiSecurity('admin')
  // @Get('users/:id')
  // async fetchUser(@Param('id') id: string): Promise<RestResponseDto> {
  //   const result: RestResponseDto = {
  //     status: ResponseStatusEnum.ERROR,
  //     payload: undefined,
  //   };

  //   const user = await Users.findOne({
  //     where: { id },
  //     relations: ['balance'],
  //   });
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }
  //   const balanceList = [...user.balance];
  //   result.payload = user;
  //   result.payload.score = user.calcScore();
  //   result.payload.total = user.calcTotal();
  //   result.payload.lastDelta = balanceList.pop()?.value || 0;
  //   result.status = ResponseStatusEnum.SUCCESS;

  //   return result;
  // }

  // @UseGuards(AdminGuard)
  // @ApiOperation({ summary: 'Получить список пользователей с балансами' })
  // @ApiResponse({ status: 200, type: UsesListResponseDto, isArray: true })
  // @ApiSecurity('admin')
  // @Get('users')
  // async allUsers(): Promise<RestListResponseDto> {
  //   const result: RestListResponseDto = {
  //     status: ResponseStatusEnum.ERROR,
  //     total: 0,
  //     offset: 0,
  //     limit: 0,
  //     payload: [],
  //   };

  //   const usersList = await Users.find({
  //     relations: ['balance', 'track'],
  //   });
  //   result.payload = usersList.map((user) => {
  //     return {
  //       ...user,
  //       score: user.calcScore(),
  //       total: user.calcTotal(),
  //       lastDelta: user.balance.pop()?.value || 0,
  //     };
  //   });
  //   result.status = ResponseStatusEnum.SUCCESS;
  //   result.total = usersList.length;
  //   result.limit = usersList.length;

  //   return result;
  // }
}
