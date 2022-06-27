import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAnonymousGuard } from '../../auth/guards/gql-anonymous.guard';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { Comment } from '../../comment/comment.models';
import { CommentsService } from '../../comment/services/comment.service';
import { RatePayload } from '../../rating/entities/rate.payload';
import { RatingStatus } from '../../rating/entities/rating-status.enum';
import { RatingService } from '../../rating/services/rating.service';
import { User } from '../../user/entities/user.entity';

import { CreatePostInput } from '../dto/create-post.input';
import { CreatePostPayload } from '../entities/create-post.payload';
import { DeletePostPayload } from '../entities/delete-post.payload';
import { UpdatePostInput } from '../dto/update-post.input';
import { UpdatePostPayload } from '../entities/update-post.payload';
import PostsLoaders from '../post.loader';
import { Post } from '../post.models';
import { PostsService } from '../services/post.service';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(() => Post)
export class PostsResolver {
  public constructor(
    private readonly postsService: PostsService,
    private readonly postsLoaders: PostsLoaders,
    private readonly commentsService: CommentsService,
    private readonly ratingService: RatingService,
  ) {}

  // @Query(() => Post, { nullable: true })
  // @UseGuards(GqlAnonymousGuard)
  // public async getPost(
  //   @Args('id', { type: () => Int }) id: string,
  // ): Promise<Post> {
  //   return this.postsService.getPostById(id);
  // }

  // @Query(() => [Post])
  // @UseGuards(GqlAnonymousGuard)
  // public async getPosts(): Promise<Post[]> {
  //   return this.postsService.getPosts();
  // }

  @Mutation(() => CreatePostPayload)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner, Role.Manager, Role.Editor)
  async createPost(
    @Args('data') feedData: CreatePostInput,
    @Args('file', { type: () => [GraphQLUpload] })
    file: FileUpload[],
    @CurrentUser() user: User,
  ): Promise<CreatePostPayload> {
    // console.log('***********uploads*********');
    // file.map(async (image) => {
    //   const { filename } = await image;
    //   console.log(filename);
    //   console.log(image);
    // });
    const userId = user.id;
    return this.postsService.createPost(feedData, file, userId);
  }

  // @Mutation(() => UpdatePostPayload)
  // @UseGuards(GqlAuthGuard)
  // public async updatePost(
  //   @Args('id', { type: () => Int }) id: string,
  //   @Args('input') input: UpdatePostInput,
  //   @CurrentUser() user: User,
  // ): Promise<UpdatePostPayload> {
  //   const userId = user.id;
  //   return this.postsService.updatePost(id, input, userId);
  // }

  @Mutation(() => DeletePostPayload)
  @UseGuards(GqlAuthGuard)
  public async deletePost(
    @Args('postId', { type: () => Int }) postId: string,
    @CurrentUser() user: User,
  ): Promise<DeletePostPayload> {
    const userId = user.id;
    return this.postsService.deletePost(postId, userId);
  }

  @Mutation(() => RatePayload)
  @UseGuards(GqlAuthGuard)
  public async upvotePost(
    @Args('postId', { type: () => Int }) postId: string,
    @CurrentUser() user: User,
  ): Promise<RatePayload> {
    const userId = user.id;
    return this.ratingService.changePostRatingStatus(
      postId,
      userId,
      RatingStatus.UPVOTED,
    );
  }

  @Mutation(() => RatePayload)
  @UseGuards(GqlAuthGuard)
  public async downvotePost(
    @Args('postId', { type: () => Int }) postId: string,
    @CurrentUser() user: User,
  ): Promise<RatePayload> {
    const userId = user.id;
    return this.ratingService.changePostRatingStatus(
      postId,
      userId,
      RatingStatus.DOWNVOTED,
    );
  }

  @Mutation(() => RatePayload)
  @UseGuards(GqlAuthGuard)
  public async removeRatingFromPost(
    @Args('postId', { type: () => Int }) postId: string,
    @CurrentUser() user: User,
  ): Promise<RatePayload> {
    const userId = user.id;
    return this.ratingService.changePostRatingStatus(
      postId,
      userId,
      RatingStatus.NEUTRAL,
    );
  }

  @ResolveField('creator', () => User)
  public async getCreator(@Parent() post: Post): Promise<User> {
    const { creatorId } = post;
    return this.postsLoaders.batchCreators.load(creatorId);
  }

  @ResolveField('comments', () => [Comment])
  public async getComments(@Parent() post: Post): Promise<Comment[]> {
    const postId = post.id;
    return this.commentsService.getCommentsByPostId(postId);
  }

  @ResolveField('myRatingStatus', () => RatingStatus)
  public async getMyRatingStatus(
    @Parent() post: Post,
    @CurrentUser() user: User | null,
  ): Promise<string> {
    if (user && Object.keys(user).length > 0) {
      const postId = post.id;
      const userId = user.id;
      return this.ratingService.getMyPostRatingStatus(postId, userId);
    }
    return RatingStatus.NEUTRAL;
  }
}
