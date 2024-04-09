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

@UseGuards(GqlAuthGuard)
@Resolver(Users)
export class UsersResolver {
    constructor (private readonly userService: UserService) {}
    
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

        const friends = user.friends?.map((friend): UserOutputDto => {
            const dto: UserOutputDto = {
                id: friend.friend.id,
                role: friend.friend.role,
                firstName: friend.friend.firstName,
                middleName: friend.friend.middleName,
                lastName: friend.friend.lastName,
                email: friend.friend.email,
                friends: null
            };
            return dto;
        }) || null;

        const myDto: UserOutputDto = {
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            friends,
        };
        return myDto;
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
            query = {...query, role}
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
    async createUser (@Args('data') data: UserInputDto): Promise<Users> {
        const newUserData: DeepPartial<Users> = {...data};
        const newUser = Users.create(newUserData);

        await newUser.save();
        newUser.reload();

        pubSub.publish('userAdded', { userAdded: newUser });

        return newUser as Users;
    }
}
