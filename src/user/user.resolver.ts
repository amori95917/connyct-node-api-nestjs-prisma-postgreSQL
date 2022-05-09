import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Mutation('createUser')
  // create(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  @Query('users')
  findAll() {
    return this.userService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  // @Mutation('updateUser')
  // update(
  //   @Args('updateUserInput') id: string,
  //   updateUserInput: UpdateUserInput,
  // ) {
  //   return this.userService.update(id, updateUserInput);
  // }

  // @Mutation('removeUser')
  // remove(@Args('id') id: string) {
  //   return this.userService.remove(id);
  // }
}
