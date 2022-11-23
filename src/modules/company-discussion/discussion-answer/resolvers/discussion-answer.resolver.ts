import { CompanyDiscussionRepository } from './../../discussion/repository/company-discussion.repository';
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
import { UserService } from 'src/modules/user/services/user.service';
import { DiscussionAnswerVoteInput } from '../dto/discussion-answer-vote';
import {
  DiscussionAnswerInput,
  DiscussionAnswerUpdateInput,
  ReplyToAnswerInput,
} from '../dto/discussion-answer.input';
import { OrderListDiscussionAnswer } from '../dto/order-discussion-answer.input';
import { DiscussionAnswerReplyPaginated } from '../entities/discussion-answer-reply.entity';
import { DiscussionAnswerVotePayload } from '../entities/discussion-answer-vote.payload';
import {
  DiscussionAnswer,
  DiscussionAnswerPaginated,
} from '../entities/discussion-answer.entity';
import {
  DiscussionAnswerDeletePayload,
  DiscussionAnswerPayload,
  DiscussionAnswerReplyPayload,
} from '../entities/discussion-answer.payload';
import { DiscussionAnswerRepository } from '../repository/discussion-answer.repository';
import { DiscussionAnswerService } from '../services/discussion-answer.service';
import { CompanyDiscussion } from '../../discussion/entities/company-discussion.entity';

@Resolver(() => DiscussionAnswer)
export class DiscussionAnswerResolver {
  constructor(
    private readonly discussionAnswerService: DiscussionAnswerService,
    private readonly discussionAnswerRepository: DiscussionAnswerRepository,
    private readonly userService: UserService,
    private readonly companyDiscussionRepository: CompanyDiscussionRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => DiscussionAnswerPaginated)
  async getDiscussionAnswerByDiscussionId(
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
  async discussionAnswerUpdate(
    @Args('updateAnswer') updateAnswer: DiscussionAnswerUpdateInput,
    @Args('answerId') answerId: string,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerPayload> {
    return await this.discussionAnswerService.updateAnswer(
      updateAnswer,
      answerId,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerDeletePayload)
  async discussionAnswerDelete(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerDeletePayload> {
    return await this.discussionAnswerService.deleteAnswer(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerVotePayload)
  async discussionAnswerVote(
    @Args('input') input: DiscussionAnswerVoteInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerVotePayload> {
    return this.discussionAnswerService.createAnswerVote(input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerVotePayload)
  async discussionAnswerDownvote(
    @Args('input') input: DiscussionAnswerVoteInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerVotePayload> {
    return this.discussionAnswerService.createAnswerDownvote(input, user.id);
  }

  @ResolveField('answerReply', () => DiscussionAnswerReplyPaginated)
  async answerReply(
    @Parent() discussionAnswer: DiscussionAnswer,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderListDiscussionAnswer,
  ) {
    const { id } = discussionAnswer;
    return await this.discussionAnswerRepository.getDiscussionAnswerReply(
      id,
      paginate,
      order,
    );
  }

  @ResolveField('discussion', () => CompanyDiscussion)
  async discussion(@Parent() discussionAnswer: DiscussionAnswer) {
    const { discussionId } = discussionAnswer;
    return await this.companyDiscussionRepository.getDiscussionById(
      discussionId,
    );
  }

  @ResolveField('user', () => User)
  async getUser(@Parent() answer: DiscussionAnswer) {
    const { userId } = answer;
    return await this.userService.findUserById(userId);
  }
}
