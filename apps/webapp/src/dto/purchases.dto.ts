import { RestListResponseDto } from './rest-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CartItemDto } from './cart.dto';
import { ProductDto } from './product.dto';
import { BalanceDto } from './balance.dto';

export class PurchasedItemDto extends CartItemDto {
  @ApiProperty({ example: 'Iris', description: 'Имя' })
  name: string;
}

export class PurchaseDto {
  @ApiProperty({ example: 321, description: 'Идентификатор покупки' })
  id: number;
  @ApiProperty({ type: BalanceDto, description: 'Транзакция' })
  transaction: BalanceDto;
  @ApiProperty({ type: ProductDto, description: 'Товар' })
  product: ProductDto;
}

export class PurhcasedReponseDto extends RestListResponseDto {
  @ApiProperty({ type: ProductDto, isArray: true, description: 'Купленные товары' })
  payload: ProductDto[];
}

export class PurhcaseHistoryReponseDto extends RestListResponseDto {
  @ApiProperty({ type: PurchaseDto, isArray: true, description: 'История покупок' })
  payload: PurchaseDto[];
}
