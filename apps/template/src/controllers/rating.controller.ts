import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import {
  ResponseStatusEnum,
  RestListResponseDto,
  RatingReponseDto,
  RatingCategoryDto,
} from '../dto';
import { AuthGuard } from './../guards';
import { RatingService } from './../services';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {
    //
  }

  @ApiOperation({ summary: 'Рейтинги' })
  @ApiResponse({ status: 200, type: RatingReponseDto })
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

    const allBoards = await this.ratingService.getAllBoards();
    const payload: RatingCategoryDto[] = allBoards.map((b) => {
      const rating = b.rating.map((r) => {
        return {
          ...r,
          user: {
            firstName: r.user.firstName,
            middleName: r.user.middleName,
            lastName: r.user.lastName,
            track: r.user.track,
          },
        };
      });
      return {
        ...b,
        rating,
      };
    });
    result.payload = payload;
    result.total = result.payload.length;
    result.limit = result.payload.length;
    result.status = ResponseStatusEnum.SUCCESS;

    return result;
  }
}
