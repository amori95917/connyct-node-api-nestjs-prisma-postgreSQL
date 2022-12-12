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
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import { OrderListCommunityMember } from '../dto/order-community-members.input';
import { OrderListCommunity } from '../dto/order-community.input';
import { CommunityMemberPaginated } from '../entities/community-member.entity';
import {
  CommunityDeletePayload,
  CommunityPayload,
  GetCommunityPayload,
} from '../entities/community-payload';
import { Community, CommunityPaginated } from '../entities/community.entity';
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
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'name', direction: 'desc' },
    })
    order: OrderListCommunity,
  ): Promise<GetCommunityPayload> {
    return await this.communityService.getCommunityByCompanyId(
      companyId,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommunityPayload)
  async getCommunityById(
    @Args('communityId') communityId: string,
  ): Promise<CommunityPayload> {
    return await this.communityService.getCommunityById(communityId);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => CommunityPayload)
  async companyCommunity(
    @Args('input') input: CommunityInput,
    @Args('profile', { type: () => GraphQLUpload, nullable: true })
    profile: FileUpload,
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
    @Args('profile', { type: () => GraphQLUpload, nullable: true })
    profile: FileUpload,
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
  @ResolveField('createdBy', () => User)
  async createdBy(@Parent() community: Community): Promise<User> {
    const { creatorId } = community;
    return await this.userService.findUserById(creatorId);
  }
  @ResolveField('members', () => CommunityMemberPaginated)
  async members(
    @Parent() community: Community,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'desc' },
    })
    order: OrderListCommunityMember,
  ): Promise<CommunityMemberPaginated> {
    const { id } = community;
    return await this.communityRepository.getCommunityMember(
      id,
      paginate,
      order,
    );
  }
  @ResolveField('followersCount', () => Number)
  async followersCount(@Parent() community: Community): Promise<number> {
    const { id } = community;
    return await this.communityRepository.getCommunityFollowersCount(id);
  }
}
