import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
// import { CreateEmployeeInput } from './dto/create-employee.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: Prisma.UserCreateInput) {
    return this.userService.createUser(createUserInput);
  }

  // @Mutation('createEmployee')
  // createEmployee(
  //   @Args('createUserInput') createEmployeeInput: CreateEmployeeInput,
  // ) {
  //   const { companyId, ...rest } = createEmployeeInput;
  //   return this.userService.createEmployee(rest, companyId);
  // }

  @Query('users')
  findAll() {
    return this.userService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: string) {
    return this.userService.findOne({ id });
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
