import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Users } from './users.entity'
import { UserOutputDto } from "../../dto/UserOutputDto";
import {
  UseGuards,
} from '@nestjs/common';
import { GqlAuthGuard } from '../../guards';

@UseGuards(GqlAuthGuard)
@Resolver(Users)
export class UsersResolver {
    // constructor (private readonly pokemonService: PokemonService) {}

    @Query(returns => UserOutputDto)
    async user (@Args('id') id: string): Promise<Users> {
        return await Users.findOne({ where: {id} });
    }
    @Query(returns => [ UserOutputDto ])
    async users () {
        return await Users.find();
    }
    /*
    @Mutation(() => UserOutputDto)
    async createUser (@Args('data') data: UserInputDto): Promise<Users> {
        const newUser = Users.create({...data});
        await newUser.save();
        return newUser;
    }
    */
}
