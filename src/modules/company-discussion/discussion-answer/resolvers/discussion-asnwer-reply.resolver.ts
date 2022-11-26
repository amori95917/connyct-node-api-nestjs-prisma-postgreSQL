import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { CompanyDiscussion } from '../../discussion/entities/company-discussion.entity';
import { CreatedBy } from '../../discussion/entities/createdBy.entity';
import { CompanyDiscussionRepository } from '../../discussion/repository/company-discussion.repository';
import { ReplyToAnswerInput } from '../dto/discussion-answer.input';
import { DiscussionAnswerReply } from '../entities/discussion-answer-reply.entity';
import { DiscussionAnswerReplyPayload } from '../entities/discussion-answer.payload';
import { DiscussionAnswerRepository } from '../repository/discussion-answer.repository';
import { DiscussionAnswerService } from '../services/discussion-answer.service';

@Resolver(() => DiscussionAnswerReply)
export class DiscussionAnswerReplyResolver {
  constructor(
    private readonly discussionAnswerService: DiscussionAnswerService,
    private readonly discussionAnswerRepository: DiscussionAnswerRepository,
    private readonly userService: UserService,
    private readonly companyDiscussionRepository: CompanyDiscussionRepository,
  ) {}
  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiscussionAnswerReplyPayload)
  async discussionAnswerReply(
    @Args('input') input: ReplyToAnswerInput,
    @CurrentUser() user: User,
  ): Promise<DiscussionAnswerReplyPayload> {
    return await this.discussionAnswerService.replyToAnswer(input, user.id);
  }

  @ResolveField('parentAnswer', () => DiscussionAnswerReply)
  async parentAnswer(@Parent() discussionAnswer: DiscussionAnswerReply) {
    const { repliedToAnswerId } = discussionAnswer;
    return await this.discussionAnswerRepository.getDiscussionAnswerByRepliedId(
      repliedToAnswerId,
    );
  }
  @ResolveField('discussion', () => CompanyDiscussion)
  async discussion(@Parent() discussionAnswer: DiscussionAnswerReply) {
    const { discussionId } = discussionAnswer;
    return await this.companyDiscussionRepository.getDiscussionById(
      discussionId,
    );
  }

  @ResolveField('upVote', () => Number)
  async upVote(@Parent() answerReply: DiscussionAnswerReply) {
    const { id } = answerReply;
    return await this.discussionAnswerRepository.countVote(id);
  }

  @ResolveField('user', () => User)
  async getUser(@Parent() answer: DiscussionAnswerReply) {
    const { userId } = answer;
    const user = await this.userService.findUserById(userId);
    return user;
  }

  @ResolveField('createdBy', () => CreatedBy)
  async createdBy(@Parent() answerReply: DiscussionAnswerReply) {
    const { userId } = answerReply;
    return await this.companyDiscussionRepository.createdBy(userId);
  }
}
