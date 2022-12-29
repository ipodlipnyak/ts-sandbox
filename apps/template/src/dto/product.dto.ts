import { ProductTypeEnum } from './../models';
import { ApiProperty } from '@nestjs/swagger';
import { RestListResponseDto } from './rest-response.dto';

export class ProductsUploadDto {
  @ApiProperty({ example: 'eff3828e-d167-4c6c-aab3-a1a3b7d8c353', description: 'Артикул' })
  code: string;
  @ApiProperty({ example: 'Iris', description: 'Имя' })
  name: string;
  @ApiProperty({
    example: 'Molestiae rerum voluptatem rerum voluptas placeat',
    description: 'Описание',
  })
  description: string;
  // @ApiProperty({ example: 'http://bleak-cluster.com/', description: 'Ссылка' })
  // link: string;
  @ApiProperty({
    example: 'The Football Is Good For Training And Recreation',
    description: 'Текст на продажу',
  })
  secret: string;
  @ApiProperty({ example: 'https://loremflickr.com/640/480/cats', description: 'Картинка' })
  image: string;
  // @ApiProperty({ example: ProductTypeEnum.REAL, description: 'Тип' })
  @ApiProperty()
  type: ProductTypeEnum;
  @ApiProperty({ example: 42, description: 'Цена' })
  price: string | number;
  @ApiProperty({ example: 'true', description: 'Активный?' })
  active: string;
}

export class ProductDto extends ProductsUploadDto {
  @ApiProperty({ example: 123, description: 'Идентификатор' })
  id: number;
  @ApiProperty({ example: '2022-07-27T10:10:22.561Z', description: 'Запись создана' })
  created: number;
  @ApiProperty({ example: '2022-07-27T10:10:22.561Z', description: 'Запись обновлена' })
  updated: number;
}

export class ProductsListReponseDto extends RestListResponseDto {
  @ApiProperty({ type: ProductDto, isArray: true, description: 'Список товаров' })
  payload: ProductDto[];
}
