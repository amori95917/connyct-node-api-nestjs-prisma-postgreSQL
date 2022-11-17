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
import { DiscussionAnswerVoteInput } from '../dto/discussion-answer-vote';
import {
  DiscussionAnswerInput,
  DiscussionAnswerUpdateInput,
  ReplyToAnswerInput,
} from '../dto/discussion-answer.input';
import { DiscussionVoteInput } from '../dto/discussion-vote.input';
import { OrderListDiscussionAnswer } from '../dto/order-discussion-answer.input';
import { OrderListDiscussion } from '../dto/order-discussion.input';
import {
  CompanyDiscussion,
  DiscussionPaginated,
} from '../entities/company-discussion.entity';
import {
  CompanyDiscussionDeletePayload,
  CompanyDiscussionPayload,
} from '../entities/company-discussion.payload';
import { DiscussionAnswerVotePayload } from '../entities/discussion-answer-vote.payload';
import {
  DiscussionAnswer,
  DiscussionAnswerPaginated,
} from '../entities/discussion-answer.entity';
import {
  DiscussionAnswerDeletePayload,
  DiscussionAnswerPayload,
} from '../entities/discussion-answer.payload';
import { DiscussionVotePayload } from '../entities/discussion-vote.payload';
import { CompanyDiscussionService } from '../services/company-discussion.service';

@Resolver(() => CompanyDiscussion)
export class CompanyDiscussionResolver {
  constructor(private companyDiscussionService: CompanyDiscussionService) {}

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
    console.log(result, 'incoming result');
    return result;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CompanyDiscussionPayload)
  async updateCompanyDiscussion(
    @Args('input') input: CompanyDiscussionUpdateInput,
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<CompanyDiscussionPayload> {
    return this.companyDiscussionService.update(input, id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CompanyDiscussionDeletePayload)
  async deleteCompanyDiscussion(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<CompanyDiscussionDeletePayload> {
    return this.companyDiscussionService.delete(id, user.id);
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
  @Query(() => DiscussionAnswerPaginated)
  async getDiscussionAnswer(
    @Args('discussionId') discussionId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderListDiscussionAnswer,
  ) {
    return await this.companyDiscussionService.getDiscussionAnswer(
      discussionId,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerPayload)
  async createDiscussionAnswer(
    @Args('answer') answer: DiscussionAnswerInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerPayload> {
    {
      return await this.companyDiscussionService.createDiscussionAnswer(
        answer,
        user.id,
      );
    }
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerPayload)
  async updateAnswer(
    @Args('updateAnswer') updateAnswer: DiscussionAnswerUpdateInput,
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerPayload> {
    return await this.companyDiscussionService.updateAnswer(
      updateAnswer,
      id,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerDeletePayload)
  async deleteAnswer(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerDeletePayload> {
    return await this.companyDiscussionService.deleteAnswer(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerDeletePayload)
  async replyToAnswer(
    @Args('input') input: ReplyToAnswerInput,
    @CurrentUser() user: User,
  ) {
    return await this.companyDiscussionService.replyToAnswer(input, user.id);
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
    return await this.companyDiscussionService.getDiscussionAnswer(
      id,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerVotePayload)
  async discussionAnswerVote(
    @Args('input') input: DiscussionAnswerVoteInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerVotePayload> {
    return this.companyDiscussionService.createAnswerVote(input, user.id);
  }
}
