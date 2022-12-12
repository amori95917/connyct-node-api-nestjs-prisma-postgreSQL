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
import { CommentRepository } from 'src/modules/community-post/repository/comment/comment.repository';
import { CommentService } from 'src/modules/community-post/services/comment/comment.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { CommentInput, MentionsInput } from '../../dto/comment/comment.input';
import { ThirdLevelCommentPayload } from '../../entities/comment/createComment.payload';
import { SecondLevelComment } from '../../entities/comment/second-level-comment.entity';
import { ThirdLevelComment } from '../../entities/comment/third-level-comment.entity';

@Resolver(() => ThirdLevelComment)
export class ThirdLevelCommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly commentRepository: CommentRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ThirdLevelCommentPayload)
  async createThirdLevelComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args('input') input: CommentInput,
    @Args('mention', { nullable: true }) mention: MentionsInput,
    @CurrentUser() user: User,
  ): Promise<ThirdLevelCommentPayload> {
    const userId = user.id;
    return this.commentService.createThirdLevelComment(
      commentId,
      input,
      userId,
      mention,
    );
  }
  @ResolveField('secondLevelComment', () => SecondLevelComment)
  async secondLevelComment(
    @Parent() replies: ThirdLevelComment,
  ): Promise<SecondLevelComment> {
    const { commentId } = replies;
    return await this.commentRepository.findCommentById(commentId);
  }

  @ResolveField('creator', () => User)
  public async getCommentCreator(
    @Parent() comment: ThirdLevelComment,
  ): Promise<User> {
    const { authorId } = comment;
    return this.userService.findUserById(authorId);
  }
}
