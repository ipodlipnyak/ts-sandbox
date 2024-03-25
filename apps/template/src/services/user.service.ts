import { Injectable, Scope, Inject } from '@nestjs/common';
import { Users, UserRole, UsersResolver } from './../models';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RatingService } from './rating.service';
import { MyRatingItemDto } from './../dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST)
    private req: Request,
    private readonly ratingService: RatingService,
  ) { }

  get userId(): string {
    return this.req.session?.whoami?.id || undefined;
  }

  get isAdmin(): boolean {
    return this.req?.session?.whoami?.role > UserRole.ADMIN;
  }

  /**
   * To authorise a user whom we found by email we will create a session with his own public data
   * 
   * @param email email to find a user
   * @returns false if user not found, true if session created succesfully
   */
  async loginByEmail(email: string): Promise<boolean> {
    const user = await Users.findOne({
      where: { email },
      select: [
        'id',
        'role',
        'active',
        'email',
        'middleName',
        'firstName',
        'lastName',
        'created',
        'updated',
      ],
    });
    if (!user || !user.active) {
      return false;  
    }

    const whoami = { ...user };
    delete whoami.active;
    this.req.session.whoami = whoami;
    return true;
  }

  /**
   * Get current user's ratings values
   */
  async getRating(): Promise<MyRatingItemDto[]> {
    const boards = await this.ratingService.getAllBoards();
    const result = [];
    const userId = this.userId;
    boards.forEach((b) => {
      const match = b.rating.find((el) => el.user.id === userId);
      if (match) {
        result.push({
          board: b.name,
          rate: match.rate,
        });
      }
    });
    return result;
  }

  /**
   * Get current user model
   */
  async getUser(): Promise<Users> {
    const id = this.userId;
    if (!id) {
      return null;
    }
    const user = await Users.findOne({
      where: { id },
      // relations: ['balance', 'purchases'],
    });
    return user;
  }
}
