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

@Controller('users')
export class UsersController {
  constructor(
    private configService: ConfigService, // private readonly userService: UserService,
    private ratingService: RatingService,
  ) {
    //
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Деактивировать пользователя' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<RestResponseDto> {
    const result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    let user = await Users.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.active = false;
    await user.save();

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
