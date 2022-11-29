import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import {
  CommunityPayload,
  GetCommunityPayload,
} from '../entities/community-payload';
import { Community } from '../entities/community.entity';
import { CommunityService } from '../services/community.service';

@Resolver(() => Community)
export class CommunityResolver {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => GetCommunityPayload)
  async community(
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
    return await this.communityService.createCommunity(input, profile, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => CommunityPayload)
  async companyCommunityEdit(
    @Args('communityId') communityId: string,
    @Args('input') input: CommunityEditInput,
  ): Promise<CommunityPayload> {
    return await this.communityService.editCommunity(input, communityId);
  }
}
