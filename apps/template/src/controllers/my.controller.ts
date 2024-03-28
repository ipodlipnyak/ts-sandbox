import { ConfigService } from '@nestjs/config';
import { RatingService, UserService } from './../services';
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
  Logger,
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
  UserNameDto,
} from '../dto';
import { AuthGuard } from './../guards';

@Controller('my')
export class MyController {
  private readonly logger = new Logger(MyController.name);

  constructor(
    private configService: ConfigService, // private readonly userService: UserService,
    private userService: UserService,
  ) {
    //
  }
  
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user`s name fields' })
  @ApiResponse({ status: 200, type: RestResponseDto})
  @ApiSecurity('user')
  @Post('name')
  async updateName(
    @Body() name: UserNameDto,
  ): Promise<RestResponseDto> {
    let result = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    try {
      const user = await this.userService.getUser();
      let isDirty = false;

      if (name?.firstName && name.firstName !== user.firstName) {
        user.firstName = name.firstName;
        isDirty = true;
      }
      if (name?.middleName && name.middleName !== user.middleName) {
        user.middleName = name.middleName;
        isDirty = true;
      }
      if (name?.lastName && name.lastName !== user.lastName) {
        user.lastName = name.lastName;
        isDirty = true;
      }

      if (isDirty) {
        user.save()
      }
      result.status = ResponseStatusEnum.SUCCESS;
    } catch(error) {
      this.logger.error(error);
    }

    return result;
  }

}
