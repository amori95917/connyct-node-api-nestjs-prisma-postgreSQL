import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { CompanyService } from 'src/modules/company/services/company.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import {
  CommunityMemberInput,
  CommunityMemberInviteInput,
} from '../dto/community-member.input';
import { OrderListCommunityMember } from '../dto/order-community-members.input';
import { CommunityMember } from '../entities/community-member.entity';
import {
  AcceptInvitePayload,
  CommunityMemberPayload,
  GetCommunityMemberPayload,
  JoinCommunityPayload,
} from '../entities/community-member.payload';
import { Community } from '../entities/community.entity';
import { CommunityRepository } from '../repository/community.repository';
import { CommunityService } from '../services/community.service';
import { CommunityRole } from '../entities/community-role.entity';

@Resolver(() => CommunityMember)
export class CommunityMemberResolver {
  constructor(
    private readonly communityService: CommunityService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly communityRepository: CommunityRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => GetCommunityMemberPayload)
  async getCommunityMember(
    @Args('communityId') communityId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'desc' },
    })
    order: OrderListCommunityMember,
  ): Promise<GetCommunityMemberPayload> {
    return await this.communityService.getCommunityMember(
      communityId,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => CommunityMemberPayload)
  async inviteUserByCommunityAdmin(
    @Args('input') input: CommunityMemberInviteInput,
    @CurrentUser() user: User,
  ): Promise<CommunityMemberPayload> {
    return await this.communityService.inviteUserByAdmin(input, user.id);
  }
  @UseGuards(GqlAuthGuard)
  @Roles(Role.User)
  @Mutation(() => AcceptInvitePayload)
  async acceptCommunityInvite(
    @Args('companyId') companyId: string,
    @Args('communityMemberId') communityMemberId: string,
    @CurrentUser() user: User,
  ): Promise<AcceptInvitePayload> {
    return await this.communityService.acceptCommunityInvite(
      companyId,
      communityMemberId,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.User)
  @Mutation(() => CommunityMemberPayload)
  async inviteUserByCommunityUser(
    @Args('input') input: CommunityMemberInviteInput,
    @CurrentUser() user: User,
  ): Promise<CommunityMemberPayload> {
    return await this.communityService.inviteUserByCommunityUser(
      input,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.User)
  @Mutation(() => JoinCommunityPayload)
  async joinPublicCommunity(
    @Args('input') input: CommunityMemberInput,
    @CurrentUser() user: User,
  ): Promise<JoinCommunityPayload> {
    return await this.communityService.joinPublicCommunity(input, user.id);
  }

  @ResolveField('community', () => Community)
  async community(
    @Parent() communityMember: CommunityMember,
  ): Promise<Community> {
    const { communityId } = communityMember;
    return await this.communityRepository.getCommunityById(communityId);
  }
  @ResolveField('member', () => User)
  async member(@Parent() communityMember: CommunityMember): Promise<User> {
    const { memberId } = communityMember;
    return await this.userService.findUserById(memberId);
  }
  @ResolveField('communityRole', () => CommunityRole)
  async communityRole(
    @Parent() communityMember: CommunityMember,
  ): Promise<CommunityRole> {
    const { memberId } = communityMember;
    return await this.communityRepository.memberRole(memberId);
  }
}
