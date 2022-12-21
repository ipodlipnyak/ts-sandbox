import { Field, ObjectType, ID } from '@nestjs/graphql';


@ObjectType()
export class UserOutputDto {
  @Field(type => ID)
  id: string;
  @Field()
  firstName: string;
  @Field()
  middleName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
}
