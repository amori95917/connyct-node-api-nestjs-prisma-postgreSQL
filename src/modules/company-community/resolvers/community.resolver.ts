import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { Company } from 'src/modules/company/entities/company.entity';
import { CompanyService } from 'src/modules/company/services/company.service';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import {
  CommunityMemberInput,
  CommunityMemberInviteInput,
} from '../dto/community-member.input';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import {
  AcceptInvitePayload,
  CommunityMemberPayload,
  JoinCommunityPayload,
} from '../entities/community-member.payload';
import {
  CommunityDeletePayload,
  CommunityPayload,
  GetCommunityPayload,
} from '../entities/community-payload';
import { Community } from '../entities/community.entity';
import { CommunityRepository } from '../repository/community.repository';
import { CommunityService } from '../services/community.service';

@Resolver(() => Community)
export class CommunityResolver {
  constructor(
    private readonly communityService: CommunityService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly communityRepository: CommunityRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => GetCommunityPayload)
  async getCommunity(
    @Args('companyId') companyId: string,
  ): Promise<GetCommunityPayload> {
    return await this.communityService.getCommunityByCompanyId(companyId);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => CommunityPayload)
  async companyCommunity(
    @Args('input') input: CommunityInput,
    @Args('profile', { type: () => GraphQLUpload }) profile: FileUpload,
    @CurrentUser()
    user: User,
  ): Promise<CommunityPayload> {
    console.log(user, 'incoming user');
    return await this.communityService.createCommunity(input, profile, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => CommunityPayload)
  async companyCommunityEdit(
    @Args('communityId') communityId: string,
    @Args('input') input: CommunityEditInput,
    @Args('profile', { type: () => GraphQLUpload }) profile: FileUpload,
    @CurrentUser() user: User,
  ): Promise<CommunityPayload> {
    return await this.communityService.editCommunity(
      input,
      communityId,
      profile,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => CommunityDeletePayload)
  async companyCommunityDelete(
    @Args('communityId') communityId: string,
    @CurrentUser() user: User,
  ): Promise<CommunityDeletePayload> {
    return await this.communityService.deleteCommunity(communityId, user.id);
  }

  @ResolveField('company', () => Company)
  async company(@Parent() community: Community): Promise<Company> {
    const { companyId } = community;
    return await this.companyService.getCompanyById(companyId);
  }
  @ResolveField('user', () => User)
  async user(@Parent() community: Community): Promise<User> {
    const { creatorId } = community;
    return await this.userService.findUserById(creatorId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommunityMemberPayload)
  async getCommunityMember(
    @Args('communityId') communityId: string,
  ): Promise<CommunityMemberPayload> {
    return await this.communityService.getCommunityMember(communityId);
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
  async community(@Parent() community: Community): Promise<Community> {
    const { id } = community;
    return await this.communityRepository.getCommunityById(id);
  }
}
