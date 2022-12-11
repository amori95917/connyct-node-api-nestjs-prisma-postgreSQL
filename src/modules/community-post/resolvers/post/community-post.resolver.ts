import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { Community } from 'src/modules/company-community/entities/community.entity';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { User } from 'src/modules/user/entities/user.entity';
import {
  CommunityPostInput,
  UpdateCommunityPostInput,
} from '../../dto/post/community-post.input';
import { CommunityPostsOrderList } from '../../dto/post/order-posts.input';
import { CommunityPostMedia } from '../../entities/post/community-post-image.entity';
import {
  CommunityPost,
  CommunityPostPaginated,
} from '../../entities/post/community-post.entity';
import {
  CommunityPostPayload,
  GetCommunityPostPayload,
} from '../../entities/post/community-post.payload';
import { DeleteCommunityPostPayload } from '../../entities/post/delete-post.payload';
import { UpdateCommunityPostPayload } from '../../entities/post/update-post.payload';
import { CommunityPostRepository } from '../../repository/post/community-post.repository';
import { CommunityPostService } from '../../services/post/community-post.service';

@Resolver(() => CommunityPost)
export class CommunityPostResolver {
  constructor(
    private readonly communityPostService: CommunityPostService,
    private readonly communityPostRepository: CommunityPostRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => GetCommunityPostPayload)
  public async communityPost(
    @Args('communityId', { type: () => String }) communityId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'desc' },
    })
    order: CommunityPostsOrderList,
  ): Promise<GetCommunityPostPayload> {
    return this.communityPostService.findPostsByCommunityId(
      communityId,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommunityPostPayload)
  async communityPostCreate(
    @Args('input') input: CommunityPostInput,
    @CurrentUser() user: User,
    @Args('files', { type: () => [GraphQLUpload], nullable: true })
    files: FileUpload[],
  ): Promise<CommunityPostPayload> {
    return await this.communityPostService.create(input, user.id, files);
  }

  @Mutation(() => UpdateCommunityPostPayload)
  @UseGuards(GqlAuthGuard)
  async communityPostUpdate(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args({ name: 'imageURL', nullable: true, type: () => String })
    imageURL: string,
    @Args({ name: 'input', nullable: true }) input: UpdateCommunityPostInput,
    @Args({ name: 'file', nullable: true, type: () => GraphQLUpload })
    file: FileUpload,
    @CurrentUser()
    user: User,
  ): Promise<UpdateCommunityPostPayload> {
    const userId = user.id;
    return this.communityPostService.update(id, imageURL, input, file, userId);
  }

  @Mutation(() => DeleteCommunityPostPayload)
  @UseGuards(GqlAuthGuard)
  public async communityPostDelete(
    @Args('postId', { type: () => String }) postId: string,
    @CurrentUser() user: User,
  ): Promise<DeleteCommunityPostPayload> {
    const userId = user.id;
    return this.communityPostService.delete(postId, userId);
  }

  @ResolveField('communityPostMedia', () => [CommunityPostMedia])
  async communityPostMedia(
    @Parent() communityPost: CommunityPost,
  ): Promise<CommunityPostMedia[]> {
    const { id } = communityPost;
    return await this.communityPostRepository.communityPostMedia(id);
  }
  @ResolveField('community', () => Community)
  async community(@Parent() communityPost: CommunityPost): Promise<Community> {
    const { communityId } = communityPost;
    return await this.communityPostRepository.community(communityId);
  }
}
