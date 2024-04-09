import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
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

@UseGuards(GqlAuthGuard)
@Resolver(Users)
export class UsersResolver {
    constructor (private readonly userService: UserService) {}

    @Query(returns => UserOutputDto)
    async whoami(): Promise<Users> {
        const user = await this.userService.getUser();
        const id = user.id;
        return await Users.findOne({ where: {id} });
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
