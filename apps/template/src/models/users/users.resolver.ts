import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Users } from './users.entity'
import { UserInputDto } from '../../dto/user.dto';
import { UserOutputDto } from "../../dto/UserOutputDto";

@Resolver(Users)
export class UsersResolver {
    // constructor (private readonly pokemonService: PokemonService) {}

    @Query(returns => [ UserOutputDto ])
    async users () {
        return [];
        // return await Users.find();
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
