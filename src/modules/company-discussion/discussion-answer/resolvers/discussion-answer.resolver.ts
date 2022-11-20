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
import { DiscussionAnswerVoteInput } from '../dto/discussion-answer-vote';
import {
  DiscussionAnswerInput,
  DiscussionAnswerUpdateInput,
  ReplyToAnswerInput,
} from '../dto/discussion-answer.input';
import { OrderListDiscussionAnswer } from '../dto/order-discussion-answer.input';
import { DiscussionAnswerVotePayload } from '../entities/discussion-answer-vote.payload';
import { DiscussionAnswerPaginated } from '../entities/discussion-answer.entity';
import {
  DiscussionAnswerDeletePayload,
  DiscussionAnswerPayload,
} from '../entities/discussion-answer.payload';
import { DiscussionAnswerService } from '../services/discussion-answer.service';

@Resolver()
export class DiscussionAnswerResolver {
  constructor(
    private readonly discussionAnswerService: DiscussionAnswerService,
  ) {}

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
    return await this.discussionAnswerService.getDiscussionAnswer(
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
      return await this.discussionAnswerService.createDiscussionAnswer(
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
    return await this.discussionAnswerService.updateAnswer(
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
    return await this.discussionAnswerService.deleteAnswer(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerDeletePayload)
  async replyToAnswer(
    @Args('input') input: ReplyToAnswerInput,
    @CurrentUser() user: User,
  ) {
    return await this.discussionAnswerService.replyToAnswer(input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerVotePayload)
  async discussionAnswerVote(
    @Args('input') input: DiscussionAnswerVoteInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerVotePayload> {
    return this.discussionAnswerService.createAnswerVote(input, user.id);
  }
}
