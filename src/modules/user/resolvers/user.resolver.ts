import { OrderFollowedCompanyList } from 'src/modules/follow-unfollow-company/dto/follow-company.input';
import {
  Company,
  CompanyPaginated,
} from 'src/modules/company/entities/company.entity';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User as UserPrisma } from '@prisma/client';

import { UserService } from '../services/user.service';
import { ValidationService } from '../services/validation.service';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';

import { UserDecorator } from '../decorators/user.decorator';

import { ChangePasswordInput } from '../dto/change-password.input';
import { FilterListUsers } from '../dto/filter-user.input';
import { OrderListUsers } from '../dto/order-users.input';
import { UpdateStatusUserInput, UpdateUserInput } from '../dto/user.input';
import { User, UserPaginated } from '../entities/user.entity';
import { FollowCompanyService } from 'src/modules/follow-unfollow-company/services/follow-company.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
    private readonly followCompanyService: FollowCompanyService,
  ) {}

  @ResolveField(() => Boolean)
  @Roles(Role.Admin, Role.User)
  async isAdmin(@Parent() user: User): Promise<boolean> {
    return await this.validationService.isAdmin(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  @Roles(Role.Admin)
  async updateStatusUser(@Args('data') params: UpdateStatusUserInput) {
    return await this.userService.updateStatusUser(params);
  }

  @Roles(Role.Admin)
  @Query(() => UserPaginated)
  async listUsers(
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'username', direction: 'desc' },
    })
    order: OrderListUsers,
    @Args('filter', { nullable: true })
    filter: FilterListUsers,
  ) {
    return await this.userService.list(paginate, order, filter);
  }

  @Query(() => User)
  @Roles(Role.Admin, Role.Owner, Role.Manager, Role.Editor, Role.User)
  async me(@UserDecorator() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  @Roles(Role.Admin, Role.User)
  async getUser(@Args('userId') userId: string): Promise<UserPrisma> {
    return await this.userService.getUser(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.User)
  @Query(() => CompanyPaginated, { nullable: true })
  async getCompanysFollowedByUser(
    @Args('paginate', { nullable: true }) paginate: PaginationArgs,
    @Args('order', { nullable: true }) order: OrderFollowedCompanyList,
    @UserDecorator() user: User,
  ) {
    const { id } = user;
    return this.followCompanyService.getCompanyFollowedByUser(
      id,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  @Roles(Role.Admin, Role.User)
  async updateUser(
    @UserDecorator() user: User,
    @Args('data') params: UpdateUserInput,
  ): Promise<UserPrisma> {
    return await this.userService.updateUser(user.id, params);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  @Roles(Role.Admin, Role.User)
  async changePassword(
    @UserDecorator() user: User,
    @Args('data') changePassword: ChangePasswordInput,
  ): Promise<UserPrisma> {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword,
    );
  }
}
