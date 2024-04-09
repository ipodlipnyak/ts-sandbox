import { Injectable, Scope, Inject } from '@nestjs/common';
import { Users, UserRole, UsersResolver } from './../models';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RatingService } from './rating.service';
import { MyRatingItemDto, SessionDto, UserNameDto } from './../dto';
import { IncomingMessage } from 'http';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST)
    private req: Request,
    private readonly ratingService: RatingService,
  ) { }
  get session(): SessionDto | null {
    const req = this.req as any;
    if (req?.session) {
      return req.session;
    }

    // freacking apollo graphql context meddling with request
    return req?.req?.session || null;
  }
  get userId(): string {
    return this.session?.whoami?.id || undefined;
  }

  get isAdmin(): boolean {
    return this.session?.whoami?.role > UserRole.ADMIN;
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
        'pictureUrl',
        'created',
        'updated',
      ],
    });
    if (!user || !user.active) {
      return false;  
    }

    const whoami = { ...user };
    delete whoami.active;
    this.session.whoami = whoami;
    return true;
  }

  /**
   * Refresh session fields with user data
   */
  async refreshWhoami() {
    const user = await this.getUser();

    this.session.whoami = { 
      ...this.session.whoami,
      ...{
        role: user.role,
        email: user.email,
        middleName: user.middleName,
        lastName: user.lastName,
        firstName: user.firstName,
        pictureUrl: user.pictureUrl,
        updated: user.updated,
      }
    };

  }

  /**
   * Update name fields for current user 
   * @param name 
   * @returns 
   */
  async updateName(name: UserNameDto): Promise<boolean> {
    let result = false;

    const user = await this.getUser();
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
      await user.save();
      await this.refreshWhoami();
      result = true;
    }

    return result;
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
      relations: ['balance', 'purchases'],
    });
    return user;
  }

  async getEmail(): Promise<string> {
    return (await this.getSession()).whoami.email; 
  }

  async getSession(): Promise<SessionDto> {
    return await this.req.session;
  }
}
