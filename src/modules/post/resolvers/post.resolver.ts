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
import { Product } from '../entities/product.entity';
import { Tag } from '../entities/tags.entity';

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
    @Args({ name: 'file', nullable: true, type: () => [GraphQLUpload] })
    file: FileUpload[],
    @CurrentUser() user: User,
  ): Promise<CreatePostPayload> {
    const userId = user.id;
    return this.postsService.createPost(feedData, file, userId);
  }

  @Mutation(() => UpdatePostPayload)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner, Role.Manager, Role.Editor)
  public async updatePost(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args({ name: 'productId', nullable: true, type: () => String })
    productId: string,
    @Args({ name: 'input', nullable: true }) input: CreatePostInput,
    @Args({ name: 'file', nullable: true, type: () => GraphQLUpload })
    file: FileUpload,
    @CurrentUser()
    user: User,
  ): Promise<UpdatePostPayload> {
    const userId = user.id;
    return this.postsService.updatePost(id, productId, input, file, userId);
  }

  @Mutation(() => DeletePostPayload)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner, Role.Manager, Role.Editor)
  public async deletePost(
    @Args('postId', { type: () => String }) postId: string,
    @CurrentUser() user: User,
  ): Promise<DeletePostPayload> {
    const userId = user.id;
    return this.postsService.deletePost(postId, userId);
  }

  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  public async getPostsByCompanyId(
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.postsService.findPostsByCompanyId(id);
  }
  @ResolveField('product', () => [Product])
  public async getProductsByPosts(@Parent() post: Post) {
    const { id } = post;
    return this.postsService.findProducts(id);
  }
  @ResolveField('tags', () => [Tag])
  public async getTags(@Parent() post: Post) {
    const { id } = post;
    return this.postsService.findTags(id);
  }

  @Query(() => [Post], { nullable: true })
  @UseGuards(GqlAuthGuard)
  public async getCompanyPostsFollowedByUser(@CurrentUser() user: User) {
    const { id } = user;
    return this.postsService.findCompanyPostsFollowedByUser(id);
  }

  @ResolveField('product', () => [Product])
  public async getCompanyPostProductsFollowedByUser(@Parent() post: Post) {
    const { id } = post;
    return this.postsService.findCompanyPostProductsFollowedByUser(id);
  }
  @ResolveField('tags', () => [Tag])
  public async getCompanyPostTagsFollowedByUser(@Parent() post: Post) {
    const { id } = post;
    return this.postsService.findCompanyPostTagsFollowedByUser(id);
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
