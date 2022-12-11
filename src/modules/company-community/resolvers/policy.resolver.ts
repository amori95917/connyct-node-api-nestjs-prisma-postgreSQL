import { UseGuards } from '@nestjs/common';
import { Query, Args, Resolver, Mutation } from '@nestjs/graphql';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import {
  CommunityPolicyInput,
  CommunityPolicyUpdateInput,
} from '../dto/policy.input';

import { CommunityPolicy } from '../entities/policy.entity';
import {
  CommunityPoliciesPayload,
  CommunityPolicyPayload,
  CommunityPolicyDeletePayload,
} from '../entities/policy.payload';
import { CommunityService } from '../services/community.service';

@Resolver(() => CommunityPolicy)
export class CommunityPolicyResolver {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => CommunityPoliciesPayload)
  async getCommunityPolicies(
    @Args('communityId') communityId: string,
    @Args() paginate: ConnectionArgs,
  ): Promise<CommunityPoliciesPayload> {
    return await this.communityService.getCommunityPolicies(
      communityId,
      paginate,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommunityPolicy)
  async getCommunityPolicy(@Args('id') policyId: string) {
    return await this.communityService.getCommunityPolicy(policyId);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => CommunityPolicyPayload)
  async createCommunityPolicy(
    @Args('id') communityId: string,
    @Args('input') input: CommunityPolicyInput,
  ) {
    return await this.communityService.createCommunityPolicy(
      communityId,
      input,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommunityPolicyPayload)
  async updateCommunityPolicy(
    @Args('id') policyId: string,
    @Args('input') input: CommunityPolicyUpdateInput,
  ) {
    return await this.communityService.updateCommunityPolicy(policyId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommunityPolicyDeletePayload)
  async deleteCommunityPolicy(@Args('id') policyId: string) {
    return await this.communityService.deleteCommunityPolicy(policyId);
  }
}
