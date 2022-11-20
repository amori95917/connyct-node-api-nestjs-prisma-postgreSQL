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
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { User } from 'src/modules/user/entities/user.entity';
import {
  CompanyDiscussionInput,
  CompanyDiscussionUpdateInput,
} from '../dto/company-discussion.inputs';

import { DiscussionVoteInput } from '../dto/discussion-vote.input';
import { OrderListDiscussionAnswer } from '../../discussion-answer/dto/order-discussion-answer.input';
import { OrderListDiscussion } from '../dto/order-discussion.input';
import {
  CompanyDiscussion,
  DiscussionPaginated,
} from '../entities/company-discussion.entity';
import {
  CompanyDiscussionDeletePayload,
  CompanyDiscussionPayload,
} from '../entities/company-discussion.payload';

import { DiscussionVotePayload } from '../../discussion-answer/entities/discussion-vote.payload';
import { CompanyDiscussionService } from '../services/company-discussion.service';
import { DiscussionAnswerRepository } from '../../discussion-answer/repository/discussion-answer.repository';
import { DiscussionAnswerPaginated } from '../../discussion-answer/entities/discussion-answer.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { CompanyService } from 'src/modules/company/services/company.service';

@Resolver(() => CompanyDiscussion)
export class CompanyDiscussionResolver {
  constructor(
    private companyDiscussionService: CompanyDiscussionService,
    private discussionAnswerRepository: DiscussionAnswerRepository,
    private companyService: CompanyService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => DiscussionPaginated)
  async getCompanyDiscussion(
    @Args('companyId') companyId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'desc' },
    })
    order: OrderListDiscussion,
  ) {
    return this.companyDiscussionService.find(companyId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CompanyDiscussion])
  async getCompanyDiscussionByUser(@CurrentUser() user: User) {
    return this.companyDiscussionService.findByUserId(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CompanyDiscussionPayload)
  async companyDiscussion(
    @Args('input') input: CompanyDiscussionInput,
    @CurrentUser() user: User,
  ): Promise<CompanyDiscussionPayload> {
    const result = await this.companyDiscussionService.createDiscussion(
      input,
      user.id,
    );
    return result;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CompanyDiscussionPayload)
  async companyDiscussionUpdate(
    @Args('input') input: CompanyDiscussionUpdateInput,
    @Args('discussionId') discussionId: string,
    @CurrentUser() user: User,
  ): Promise<CompanyDiscussionPayload> {
    return this.companyDiscussionService.update(input, discussionId, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CompanyDiscussionDeletePayload)
  async companyDiscussionDelete(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<CompanyDiscussionDeletePayload> {
    return this.companyDiscussionService.delete(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Number)
  async discussionVoteCount(@Args('discussionId') discussionId: string) {
    return this.companyDiscussionService.countVote(discussionId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionVotePayload)
  async discussionVote(
    @Args('input') input: DiscussionVoteInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionVotePayload> {
    return this.companyDiscussionService.createVote(input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionVotePayload)
  async discussionDownvote(
    @Args('input') input: DiscussionVoteInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionVotePayload> {
    return await this.companyDiscussionService.downVote(input, user.id);
  }

  @ResolveField('discussionAnswer', () => DiscussionAnswerPaginated)
  async answer(
    @Parent() discussion: CompanyDiscussion,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderListDiscussionAnswer,
  ) {
    const { id } = discussion;
    console.log(id, 'incoming id');
    return await this.discussionAnswerRepository.getDiscussionAnswerByDiscussionId(
      id,
      paginate,
      order,
    );
  }

  @ResolveField('company', () => Company)
  async company(@Parent() discussion: CompanyDiscussion): Promise<Company> {
    const { companyId } = discussion;
    return await this.companyService.getCompanyById(companyId);
  }
}
