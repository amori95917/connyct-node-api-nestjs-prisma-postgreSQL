import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { customError } from 'src/common/errors';
import {
  COMMUNITY_CODE,
  COMPANY_DISCUSSION_CODE,
  POST_CODE,
} from 'src/common/errors/error.code';
import {
  COMMUNITY_MESSAGE,
  COMPANY_DISCUSSION_MESSAGE,
  POST_MESSAGE,
} from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CommunityRepository } from 'src/modules/company-community/repository/community.repository';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import {
  CommunityPostInput,
  UpdateCommunityPostInput,
} from '../../dto/post/community-post.input';
import { CommunityPostsOrderList } from '../../dto/post/order-posts.input';
import {
  CommunityPostPayload,
  GetCommunityPostPayload,
} from '../../entities/post/community-post.payload';
import { DeleteCommunityPostPayload } from '../../entities/post/delete-post.payload';
import { UpdateCommunityPostPayload } from '../../entities/post/update-post.payload';
import { CommunityPostRepository } from '../../repository/post/community-post.repository';
import { ApolloError } from 'apollo-server-express';
import { FollowUnfollowRepository } from 'src/modules/follow-unfollow-company/repository/followUnfollow.repository';

@Injectable()
export class CommunityPostService {
  constructor(
    private readonly communityPostRepository: CommunityPostRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly followUnfollowRepository: FollowUnfollowRepository,
  ) {}

  public async findPostsByCommunityId(
    communityId: string,
    paginate: ConnectionArgs,
    order: CommunityPostsOrderList,
  ): Promise<GetCommunityPostPayload> {
    try {
      const community = await this.communityRepository.getCommunityById(
        communityId,
      );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return this.communityPostRepository.findPostsByCompanyId(
        communityId,
        paginate,
        order,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async create(
    input: CommunityPostInput,
    userId: string,
    files: FileUpload[],
  ): Promise<CommunityPostPayload> {
    try {
      const community = await this.communityRepository.getCommunityById(
        input.communityId,
      );
      const checkOwner = await this.communityPostRepository.checkCommunityOwner(
        input.communityId,
        userId,
      );
      console.log(checkOwner, 'incoming check');
      if (checkOwner)
        return await this.communityPostRepository.create(input, userId, files);
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          community.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      const checkMember =
        await this.communityRepository.checkCommunityMemberExist(
          input.communityId,
          userId,
        );
      if (!checkMember)
        throw new ApolloError(
          COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
          COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
          { statusCode: STATUS_CODE.BAD_REQUEST_EXCEPTION },
        );
      return await this.communityPostRepository.create(input, userId, files);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  public async update(
    postId: string,
    imageURL: string,
    input: UpdateCommunityPostInput,
    file: FileUpload,
    authorId: string,
  ): Promise<UpdateCommunityPostPayload> {
    try {
      const post = await this.communityPostRepository.findPostByCreatorId(
        authorId,
        postId,
      );
      if (!post) {
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      }
      const community = await this.communityRepository.getCommunityById(
        post.communityId,
      );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          community.companyId,
          authorId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      const checkMember =
        await this.communityRepository.checkCommunityMemberExist(
          community.id,
          authorId,
        );
      if (!checkMember)
        throw new ApolloError(
          COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
          COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
          { statusCode: STATUS_CODE.BAD_REQUEST_EXCEPTION },
        );
      return await this.communityPostRepository.update(
        postId,
        imageURL,
        input,
        file,
        post,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  public async delete(
    postId: string,
    userId: string,
  ): Promise<DeleteCommunityPostPayload> {
    try {
      const post = await this.communityPostRepository.findPostByCreatorId(
        userId,
        postId,
      );
      if (!post)
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      const community = await this.communityRepository.getCommunityById(
        post.communityId,
      );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const checkOwner = await this.communityPostRepository.checkOwner(
        postId,
        userId,
      );
      if (checkOwner) return await this.communityPostRepository.delete(postId);
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          community.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      const checkMember =
        await this.communityRepository.checkCommunityMemberExist(
          community.id,
          userId,
        );
      if (!checkMember)
        throw new ApolloError(
          COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
          COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
          { statusCode: STATUS_CODE.BAD_REQUEST_EXCEPTION },
        );
      return await this.communityPostRepository.delete(post.id);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
