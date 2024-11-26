import { Resolver, Query, Mutation, Args, ResolveField, Parent, Info } from '@nestjs/graphql'
import { Users, UserRole } from './users.entity'
import { UserOutputDto, UserInputDto, RestResponseDto, ResponseStatusEnum } from "../../dto";
import {
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { GqlAdminGuard, GqlAuthGuard } from '../../guards';
import { Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DeepPartial } from 'typeorm';
import { query } from 'express';
import { UserService } from '../../services';

const pubSub = new PubSub();

// @Resolver(type => Users) // Reminder: Character is an interface
// export class UsersInterfaceResolver {
//     @ResolveField(() => [Users])
//     friends(
//       @Parent() user: any, // Resolved object that implements Character
//       @Info() { parentType }, // Type of the object that implements Character
//       @Args('search', { type: () => String }) searchTerm: string,
//     ) {
//       // Get character's friends
//       return [];
//     }
// }

async function mapUserToDto(user: Users): Promise<UserOutputDto> {
  function mapthem(user: Users): UserOutputDto {
    const dto: UserOutputDto = {
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      pictureUrl: user.pictureUrl,
      friends: null,
      followers: null,
      subscriptions: null,
    };
    return dto;
  }
  const result = mapthem(user);

  if (user?.friends) {
    const friends = await user.getFriends();
    const followers = await user.getFollowers();
    const subscriptions = await user.getSubscriptions();

    result.friends = friends.map((f) => mapthem(f));
    result.followers = followers.map((f) => mapthem(f));
    result.subscriptions = subscriptions.map((f) => mapthem(f));
  }

  return result;
}

@UseGuards(GqlAuthGuard)
@Resolver(Users)
export class UsersResolver {
    constructor(private readonly userService: UserService) { }

    @Query(returns => UserOutputDto)
    async whoami(): Promise<UserOutputDto> {
        const id = this.userService.userId;
        const user = await Users.findOne({
            where: {
                id
            },
            relations: {
                friends: true
            }
        });
        const result = mapUserToDto(user);
        return result;
    }

    // @Subscription((returns) => UserOutputDto)
    // userAdded() {
    //     pubSub.asyncIterator('userAdded');
    // }

    @Mutation(() => UserOutputDto)
    async subscribe(@Args('email') email: string): Promise<UserOutputDto> {
      const user = await this.userService.getUser();
      const friend = await user.subscribe(email);
      if (!friend) {
        throw new BadRequestException('User should be registered first');
      }
      return mapUserToDto(friend);
    }

    @Mutation(() => RestResponseDto)
    async unsubscribe(@Args('email') email: string): Promise<RestResponseDto> {
      const result: RestResponseDto = {
        status: ResponseStatusEnum.SUCCESS,
      }
      const user = await this.userService.getUser();
      await user.unsubscribe(email);

      return result;
    }

    @Mutation(() => RestResponseDto)
    async unfollow(@Args('email') email: string): Promise<RestResponseDto> {
      const result: RestResponseDto = {
        status: ResponseStatusEnum.SUCCESS,
      }
      const user = await this.userService.getUser();
      await user.unfollow(email);

      return result;
    }

    @UseGuards(GqlAdminGuard)
    @Mutation(() => UserOutputDto)
    async makeFriend(@Args('email') email: string): Promise<UserOutputDto> {
      const user = await this.userService.getUser();
      const friend = await user.makeFriend(email);
      return mapUserToDto(friend);
    }

    @UseGuards(GqlAdminGuard)
    @Mutation(() => RestResponseDto)
    async unmakeFriend(@Args('email') email: string): Promise<RestResponseDto> {
      const user = await this.userService.getUser();
      const friend = await user.unmakeFriend(email);

      return {
        status: ResponseStatusEnum.SUCCESS
      };
    }
}
