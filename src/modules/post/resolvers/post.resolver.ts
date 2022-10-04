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
import { Post, PostPagination } from '../post.models';
import { PostsService } from '../services/post.service';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Product } from '../entities/product.entity';
import { Tag } from '../entities/tags.entity';
import { PostImage } from '../entities/post-image.entity';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { OrderPosts } from '../dto/order-posts.input';

@Resolver(() => Post)
export class PostsResolver {
  public constructor(
    private readonly postsService: PostsService,
    private readonly postsLoaders: PostsLoaders,
    private readonly commentsService: CommentsService,
    private readonly ratingService: RatingService,
  ) {}

  @Mutation(() => CreatePostPayload)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner, Role.Manager, Role.Editor)
  /**TODO */
  /**check if the owner,manager or editor are associated with actual company or not */
  async post(
    @Args('data') feedData: CreatePostInput,
    @Args('companyId') companyId: string,
    @Args({
      name: 'file',
      nullable: true,
      type: () => [GraphQLUpload],
    })
    file: FileUpload[],
    @CurrentUser() user: User,
  ): Promise<CreatePostPayload> {
    const userId = user.id;
    return this.postsService.createPost(feedData, companyId, file, userId);
  }

  @Mutation(() => UpdatePostPayload)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner, Role.Manager, Role.Editor)
  public async postUpdate(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args({ name: 'imageURL', nullable: true, type: () => String })
    imageURL: string,
    @Args({ name: 'input', nullable: true }) input: UpdatePostInput,
    @Args({ name: 'file', nullable: true, type: () => GraphQLUpload })
    file: FileUpload,
    @CurrentUser()
    user: User,
  ): Promise<UpdatePostPayload> {
    const userId = user.id;
    return this.postsService.updatePost(id, imageURL, input, file, userId);
  }

  @Mutation(() => DeletePostPayload)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner, Role.Manager, Role.Editor)
  public async postDelete(
    @Args('postId', { type: () => String }) postId: string,
    @CurrentUser() user: User,
  ): Promise<DeletePostPayload> {
    const userId = user.id;
    return this.postsService.deletePost(postId, userId);
  }

  @Query(() => PostPagination)
  @UseGuards(GqlAuthGuard)
  public async postsByCompanyId(
    @Args('id', { type: () => String }) id: string,
    @Args() paginate: ConnectionArgs,
  ) {
    return this.postsService.findPostsByCompanyId(id, paginate);
  }
  @ResolveField('postImage', () => [PostImage])
  public async postImageByPosts(@Parent() post: Post) {
    const { id } = post;
    return this.postsService.findPostImage(id);
  }
  @ResolveField('tags', () => [Tag])
  public async getTags(@Parent() post: Post) {
    const { id } = post;
    return this.postsService.findTags(id);
  }

  @Query(() => PostPagination, { nullable: true })
  @UseGuards(GqlAuthGuard)
  public async companyPostsFollowedByUser(
    @CurrentUser() user: User,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'desc' },
    })
    order: OrderPosts,
  ) {
    const { id } = user;
    return this.postsService.findCompanyPostsFollowedByUser(
      id,
      paginate,
      order,
    );
  }

  @ResolveField('postImage', () => [PostImage])
  public async companyPostImageFollowedByUser(@Parent() post: Post) {
    const { id } = post;
    return this.postsService.findCompanyPostImageFollowedByUser(id);
  }
  @ResolveField('tags', () => [Tag])
  public async companyPostTagsFollowedByUser(@Parent() post: Post) {
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
