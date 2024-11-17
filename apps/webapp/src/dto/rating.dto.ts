import { RestListResponseDto } from './rest-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserPublicDto, UserCachedDto } from './user.dto';

export class MyRatingItemDto {
  @ApiProperty({ example: 'Общий', description: 'Категория рейтинга' })
  board: string;
  @ApiProperty({ example: 1, description: 'Место в рейтинге' })
  rate: number;
}

export class RatingItemDto {
  @ApiProperty({ example: 1, description: 'Место в рейтинге' })
  rate: number;
  @ApiProperty({ example: 1000, description: 'Баллы' })
  score: number;
  @ApiProperty({ description: 'Пользователь' })
  user: UserPublicDto;
}

export class RatingItemCachedDto extends RatingItemDto {
  @ApiProperty({ description: 'Пользователь' })
  user: UserCachedDto;
}

export class RatingCategoryDto {
  @ApiProperty({ example: 'Общий', description: 'Категория рейтинга' })
  name: string;
  @ApiProperty({ type: RatingItemDto, isArray: true, description: 'Рейтинг' })
  rating: RatingItemDto[];
}

export class RatingCategoryCachedDto extends RatingCategoryDto {
  @ApiProperty({ type: RatingItemDto, isArray: true, description: 'Рейтинг' })
  rating: RatingItemCachedDto[];
}

export class RatingReponseDto extends RestListResponseDto {
  @ApiProperty({ type: RatingCategoryDto, isArray: true, description: 'Рейтинги' })
  payload: RatingCategoryDto[];
}
