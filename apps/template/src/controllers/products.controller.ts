import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestResponseDto,
  RestListResponseDto,
  ProductsUploadDto,
  PurhcasedReponseDto,
} from '../dto';
import { AdminGuard, AuthGuard } from './../guards';
import { Product, Purchase } from './../models';
import { UserService } from './../services';

@Controller('products')
export class ProductsController {
  constructor(private readonly userService: UserService) {
    //
  }

  @ApiOperation({ summary: 'Список товаров' })
  @ApiResponse({ status: 200, type: PurhcasedReponseDto })
  @ApiSecurity('user')
  @ApiSecurity('admin')
  @UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<RestListResponseDto> {
    const result: RestListResponseDto = {
      status: ResponseStatusEnum.ERROR,
      total: 0,
      offset: 0,
      limit: 0,
      payload: undefined,
    };

    const allProducts = await Product.find();
    const isAdmin = this.userService.isAdmin;

    if (isAdmin) {
      const countPurchasesList = await Purchase.countProductsPurchases();
      result.payload = allProducts.map((el) => {
        const countPurchases = countPurchasesList.find((pc) => pc.productId === el.id)?.count || 0;
        return {
          ...el,
          countPurchases: Number(countPurchases),
        };
      });
    } else {
      const user = await this.userService.getUser();
      const purchased = user.getPurchasedProducts();
      // Not gonna show secrets until they are bought
      result.payload = allProducts.map((p) => {
        const isBought = !!purchased.find((el) => p.id === el.id);
        return {
          ...p,
          secret: isBought ? p.secret : '',
        };
      });
    }

    result.total = result.payload.length;
    result.limit = result.payload.length;
    result.status = ResponseStatusEnum.SUCCESS;

    return result;
  }

  @ApiOperation({ summary: 'Загрузить список товаров' })
  @ApiResponse({ status: 200, type: RestResponseDto })
  @ApiSecurity('admin')
  @UseGuards(AdminGuard)
  @Post()
  async upload(@Body() productsList: ProductsUploadDto[]): Promise<RestResponseDto> {
    const result: RestResponseDto = {
      status: ResponseStatusEnum.ERROR,
      payload: undefined,
    };
    const existedProducts = await Product.find();

    const productsDataToUpdate = productsList
      .map((newData) => {
        let product = existedProducts.find((el) => el.code === newData.code);
        if (!product) {
          product = Product.create();
        }

        product.code = newData.code;
        product.name = newData.name;
        product.description = newData.description;
        // product.link = newData.link;
        product.secret = newData.secret;
        product.image = newData.image;
        product.price = Number(newData.price);
        product.type = newData.type;

        // it will be active if it has some value that is not considered as a negative
        product.active = !!newData.active;
        const isInactive = ['false', 'f'].indexOf(newData.active?.toLowerCase()) > -1;
        if (isInactive) {
          product.active = false;
        }

        return product;
      })
      .filter((el) => !!el);

    /** update and create */
    productsDataToUpdate.forEach((product) => product.save());

    result.status = ResponseStatusEnum.SUCCESS;
    return result;
  }
}
