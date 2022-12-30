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
import {
  Company,
  CompanyPaginated,
} from 'src/modules/company/entities/company.entity';
import { OrderFollowedCompanyList } from 'src/modules/follow-unfollow-company/dto/follow-company.input';

import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { UserService } from '../services/user.service';
import { ValidationService } from '../services/validation.service';

import { UserDecorator } from '../decorators/user.decorator';

import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Role as RoleEntity } from 'src/modules/auth/entities/role.entity';
import { FilterListCompanies } from 'src/modules/company/dto/filter-company.input';
import { OrderListCompanies } from 'src/modules/company/dto/order-companies.input';
import { CompanyService } from 'src/modules/company/services/company.service';
import { FollowCompanyService } from 'src/modules/follow-unfollow-company/services/follow-company.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { ChangePasswordInput } from '../dto/change-password.input';
import { FilterListUsers } from '../dto/filter-user.input';
import { OrderListUsers } from '../dto/order-users.input';
import { UpdateStatusUserInput, UpdateUserInput } from '../dto/user.input';
import { UserProfileInput } from '../dto/userProfile.input';
import { UserConnectionsSummaryEntity } from '../entities/user-connections.entity';
import { User, UserPaginated } from '../entities/user.entity';
import { UserProfilePayload } from '../entities/userProfile.payload';
import { UserProfile } from '../userProfile.model';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
    private readonly followCompanyService: FollowCompanyService,
    private readonly companyService: CompanyService,
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

  @UseGuards(GqlAuthGuard)
  @Query(() => UserPaginated)
  @Roles(Role.Admin, Role.User)
  async listUsers(
    @Args() paginate: ConnectionArgs,
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
    console.log('CURRENT USER IS', user);
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Query(() => User)
  async getUser(@Args('userId') userId: string): Promise<User> {
    return await this.userService.getUser(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.User)
  @Query(() => CompanyPaginated, { nullable: true })
  async getCompanysFollowedByUser(
    @Args() paginate: ConnectionArgs,
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

  @UseGuards(GqlAuthGuard)
  @Roles(Role.User)
  @Query(() => CompanyPaginated)
  async companiesSuggestions(
    @UserDecorator() user: User,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'name', direction: 'desc' },
    })
    order: OrderListCompanies,
    @Args('filter', { nullable: true }) filter: FilterListCompanies,
  ) {
    return this.followCompanyService.companiesSuggestions(
      user.id,
      paginate,
      order,
      filter,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.User)
  @Mutation(() => UserProfilePayload)
  async editUserProfile(
    @Args('userProfile') userProfile: UserProfileInput,
    @Args({ name: 'file', nullable: true, type: () => GraphQLUpload })
    file: FileUpload,
    @CurrentUser() user: User,
  ): Promise<UserProfilePayload> {
    const { id } = user;
    return await this.userService.editUserProfile(userProfile, file, id);
  }

  @ResolveField('company', () => [Company])
  @UseGuards(GqlAuthGuard)
  async company(@Parent() user: User) {
    const company = await this.companyService.getCompanyByUserId(user.id);
    return company;
  }

  @ResolveField('userProfile', () => UserProfile)
  async userProfile(@Parent() user: User): Promise<UserProfile | null> {
    const { id } = user;
    return await this.userService.getUserProfile(id);
  }

  @ResolveField('role', () => RoleEntity)
  async role(@Parent() user: User): Promise<RoleEntity> {
    const { id } = user;
    return await this.userService.getUserRole(id);
  }

  @ResolveField('roles', () => [RoleEntity])
  async roles(@Parent() user: User) {
    const { id } = user;
    const roles = await this.userService.getUserRoles(id);
    return roles;
  }

  @ResolveField('activeRole', () => RoleEntity)
  async activeRole(@Parent() user: User) {
    // const { id } = user;
    return await this.userService.getUserActiveRole(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserConnectionsSummaryEntity)
  async userConnectionsSummary(@UserDecorator() user: User) {
    return await this.userService.userConnectionsSummary(user.id);
  }
}
