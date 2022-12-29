import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Users, UserRole } from './users.entity'
import { UserOutputDto, UserInputDto } from "../../dto";
import {
    UseGuards,
} from '@nestjs/common';
import { GqlAuthGuard } from '../../guards';
import { Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DeepPartial } from 'typeorm';

const pubSub = new PubSub();

@UseGuards(GqlAuthGuard)
@Resolver(Users)
export class UsersResolver {
    // constructor (private readonly pokemonService: PokemonService) {}

    @Query(returns => UserOutputDto)
    async user(@Args('id') id: string): Promise<Users> {
        return await Users.findOne({ where: { id } });
    }

    @Query(returns => [UserOutputDto])
    async users() {
        return await Users.find();
    }

    @Subscription((returns) => UserOutputDto)
    userAdded() {
        pubSub.asyncIterator('userAdded');
    }
    @Mutation(() => UserOutputDto)
    async createUser (@Args('data') data: UserInputDto): Promise<Users> {
        const newUserData: DeepPartial<Users> = {...data};
        // const newUser = new Users();
        // newUser.firstName = data.firstName;
        // newUser.middleName = data.middleName;
        // newUser.lastName = data.lastName;
        // newUser.email = data.email;
        // newUser.role = data.role || UserRole.USER;
        const newUser = Users.create(newUserData);

        await newUser.save();
        newUser.reload();

        pubSub.publish('userAdded', { userAdded: newUser });

        return newUser as Users;
    }
}
