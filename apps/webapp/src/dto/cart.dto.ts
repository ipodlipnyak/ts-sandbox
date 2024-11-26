import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    example: 42,
    description: 'Идентифиатор товара',
  })
  id: string | number;
  @ApiProperty({
    example: 1,
    description: 'Количество товара',
  })
  qty: string | number;
}

export class CartDto {
  @ApiProperty({ type: CartItemDto, isArray: true, description: 'Содержимое корзины' })
  content: CartItemDto[];
}
