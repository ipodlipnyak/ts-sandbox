import { Resolver, Query, Mutation, Args, ResolveField, Parent, Info } from '@nestjs/graphql'
import { Users, UserRole } from './users.entity'
import { UserOutputDto, UserInputDto } from "../../dto";
import {
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { GqlAuthGuard } from '../../guards';
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

    @Query(returns => UserOutputDto)
    async user(@Args('id') id: string): Promise<Users> {
        const query = {
            id,
        }
        return await Users.findOne({ where: query });
    }

    @Query(returns => [UserOutputDto])
    async users(@Args('role') role?: UserRole) {
        let query = {};
        if (role) {
            query = { ...query, role }
        }

        if (Object.keys(query).length > 0) {
            return await Users.findBy(query);
        }
        return await Users.find();
    }

    // @Subscription((returns) => UserOutputDto)
    // userAdded() {
    //     pubSub.asyncIterator('userAdded');
    // }

    @Mutation(() => UserOutputDto)
    async createUser(@Args('data') data: UserInputDto): Promise<Users> {
        const newUserData: DeepPartial<Users> = { ...data };
        const newUser = Users.create(newUserData);

        await newUser.save();
        newUser.reload();

        pubSub.publish('userAdded', { userAdded: newUser });

        return newUser as Users;
    }
}
