import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestResponseDto,
  RestListResponseDto,
  CartDto,
  PurhcasedReponseDto,
  PurhcaseHistoryReponseDto,
} from '../dto';
import { AdminGuard, AuthGuard } from './../guards';
import { Users, Balance, ERROR_NSF, ERROR_EMPTY_CART } from './../models';
import { UserService } from './../services';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly userService: UserService) {
    //
  }

  @ApiOperation({ summary: 'История покупок пользователя' })
  @ApiResponse({ status: 200, type: PurhcaseHistoryReponseDto })
  @ApiSecurity('user')
  @UseGuards(AdminGuard)
  @Get(':userId')
  async byUser(@Param('userId') userId: string): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      total: 0,
      offset: 0,
      limit: 0,
      payload: undefined,
    };

    const user = await Users.findOne({
      where: {
        id: userId,
      },
      relations: ['purchases'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const payload = user.purchases.map((el) => {
      return {
        id: el.id,
        transaction: el.balance,
        product: el.product,
      };
    });

    result.payload = payload;
    result.total = result.payload.length;
    result.limit = result.payload.length;
    result.status = ResponseStatusEnum.SUCCESS;

    return result;
  }

  @ApiOperation({ summary: 'Купленные товары' })
  @ApiResponse({ status: 200, type: PurhcasedReponseDto })
  @ApiSecurity('user')
  @UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      total: 0,
      offset: 0,
      limit: 0,
      payload: [],
    };

    const user = await this.userService.getUser();
    if (!user) {
      return result;
    }

    const purchasedProducts = [];
    user.purchases.forEach((el) => {
      const match = purchasedProducts.find((p) => p.id === el.product.id);
      if (!match) {
        purchasedProducts.push(el.product);
      }
    });

    result.payload = purchasedProducts;
    result.total = result.payload.length;
    result.limit = result.payload.length;
    result.status = ResponseStatusEnum.SUCCESS;

    return result;
  }

  @ApiOperation({ summary: 'Покупка товаров' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @ApiSecurity('user')
  @UseGuards(AuthGuard)
  @Post()
  async buy(@Body() cartDto: CartDto): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };

    const userId = this.userService.userId;
    if (!userId) {
      throw new HttpException('Non existen user', HttpStatus.BAD_REQUEST);
    }

    try {
      await Balance.buy(cartDto, userId);
    } catch (error) {
      switch (error) {
        // insufficient funds
        case ERROR_NSF:
          result.payload = error.message;
          return result;
        // nothing to buy. Empty cart
        case ERROR_EMPTY_CART:
          result.payload = error.message;
          return result;
      }
      throw error;
    }

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
