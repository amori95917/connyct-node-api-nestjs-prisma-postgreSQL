import { GqlAuthGuard } from './../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { IndustryService } from './../services/industry.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IndustryInput } from '../dto/industry.dto';
import { IndustryPayload } from '../entities/industry.entity';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';

@Resolver()
export class IndustryResolver {
  constructor(private industryService: IndustryService) {}
  @Query(() => IndustryPayload)
  async getIndustry() {
    return this.industryService.getIndustry();
  }
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => IndustryPayload)
  async createIndustry(@Args('data') industryInput: IndustryInput) {
    return this.industryService.createIndustry(industryInput);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => IndustryPayload)
  async updateIndustry(
    @Args('id', { type: () => String }) id: string,
    @Args('data') industryUdate: IndustryInput,
  ) {
    return this.industryService.updateIndustry(id, industryUdate);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => IndustryPayload)
  async deleteIndustry(@Args('id', { type: () => String }) id: string) {
    return this.industryService.deleteIndustry(id);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => IndustryPayload)
  async activeOrDeactiveIndustry(
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.industryService.activeOrDeactiveIndustry(id);
  }
}
