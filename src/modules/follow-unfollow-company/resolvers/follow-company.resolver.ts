import { UnfollowCompanyInput } from './../dto/unfollow-company.input';
import { FollowUserToUser } from '../entities/follow-user-to-user.entity';
import { FollowCompany } from '../entities/follow-company.entity';
import { FollowCompanyInput } from '../dto/follow-company.input';
import { FollowCompanyService } from './../services/follow-company.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { UserDecorator } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import {
  FollowUnfollowCompany,
  FollowUserToUser as FollowUser,
} from '@prisma/client';
import { FollowUserToUserInput } from '../dto/follow-user.input';
import { UnfollowUserInput } from '../dto/unfollow-user.input';
import { UnfollowPayload } from '../entities/unfollow.payload';

@Resolver()
export class FollowCompanyResolver {
  constructor(private followCompanyService: FollowCompanyService) {}

  @Roles(Role.User)
  @Mutation(() => FollowCompany)
  async followCompany(
    @Args('data') followCompany: FollowCompanyInput,
    @UserDecorator() user: User,
  ): Promise<FollowUnfollowCompany> {
    return this.followCompanyService.followCompany(followCompany, user);
  }
  @Roles(Role.User)
  @Mutation(() => UnfollowPayload)
  async unfollowCompany(
    @Args('data') company: UnfollowCompanyInput,
    @UserDecorator() user: User,
  ): Promise<UnfollowPayload> {
    return this.followCompanyService.unfollowCompany(company, user);
  }

  @Roles(Role.User)
  @Mutation(() => FollowUserToUser)
  async followUserToUser(
    @Args('data') userToUser: FollowUserToUserInput,
    @UserDecorator() user: User,
  ): Promise<FollowUser> {
    return this.followCompanyService.followUserToUser(userToUser, user);
  }

  @Roles(Role.User)
  @Mutation(() => UnfollowPayload)
  async unfollowUser(
    @Args('data') userId: UnfollowUserInput,
    @UserDecorator() user: User,
  ): Promise<UnfollowPayload> {
    return this.followCompanyService.unfollowUser(userId, user);
  }
}
