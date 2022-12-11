import { Injectable, Scope, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Users, Track } from './../models';
import { RatingItemCachedDto, UserCachedDto, RatingCategoryCachedDto } from './../dto';

export const DEFAULT_RATING_BOARD = 'ALL';

@Injectable({ scope: Scope.REQUEST })
export class RatingService {
  boardCacheKey: string;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.boardCacheKey = 'rating-board';
  }

  async cleanBoardCache(): Promise<void> {
    await this.cacheManager.del(this.boardCacheKey);
  }

  /**
   * Get rating boards
   */
  async getAllBoards(): Promise<RatingCategoryCachedDto[]> {
    let board: RatingCategoryCachedDto[] = await this.cacheManager.get(this.boardCacheKey);
    if (!board) {
      board = await this.buildAllBoards();
      await this.cacheManager.set(this.boardCacheKey, board, {
        ttl: 86400, // 24h
      });
    }

    return board;
  }

  /**
   * Build all rating boards with categories
   */
  async buildAllBoards() {
    const allTracks = await Track.find({
      relations: ['users'],
    });
    const trackBoards: RatingCategoryCachedDto[] = allTracks.map((track) => {
      return {
        name: track.name,
        rating: this.buildBoard(track.users),
      };
    });
    const allUsers = await Users.find({
      where: {
        active: true,
      },
      relations: ['balance', 'track'],
    });
    const allBoards = [
      {
        name: DEFAULT_RATING_BOARD,
        rating: this.buildBoard(allUsers),
      },
      ...trackBoards,
    ];
    return allBoards;
  }

  /**
   * Build single rating board
   */
  buildBoard(allUsers: Users[]): RatingItemCachedDto[] {
    const ratingList = allUsers
      .map((userModel) => {
        const user: UserCachedDto = {
          id: userModel.id,
          firstName: userModel.firstName,
          middleName: userModel.middleName,
          lastName: userModel.lastName,
          track: userModel.track,
        };
        return {
          user,
          score: userModel.calcScore(),
        };
      })
      .sort((a, b) => {
        return Number(b.score) - Number(a.score);
      });
    const result: RatingItemCachedDto[] = ratingList.map((el, index) => {
      return {
        ...el,
        rate: index + 1,
      };
    });
    return result;
  }
}
