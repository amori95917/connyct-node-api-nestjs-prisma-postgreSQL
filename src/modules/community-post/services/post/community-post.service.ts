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
import { FollowCompanyService } from 'src/modules/follow-unfollow-company/services/follow-company.service';
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

@Injectable()
export class CommunityPostService {
  constructor(
    private readonly communityPostRepository: CommunityPostRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly followCompanyService: FollowCompanyService,
  ) {}

  public async findPostsByCommunityId(
    communityId: string,
    paginate: ConnectionArgs,
    order: CommunityPostsOrderList,
  ): Promise<GetCommunityPostPayload> {
    const community = await this.communityRepository.getCommunityById(
      communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return this.communityPostRepository.findPostsByCompanyId(
      communityId,
      paginate,
      order,
    );
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
      if (!community)
        return customError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          community.companyId,
          userId,
        );
      if (!followedCompany)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          STATUS_CODE.BAD_CONFLICT,
        );
      const checkMember =
        await this.communityRepository.checkCommunityMemberExist(
          input.communityId,
          userId,
        );
      if (!checkMember)
        return customError(
          COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
          COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
          STATUS_CODE.BAD_REQUEST_EXCEPTION,
        );
      return await this.communityPostRepository.create(input, userId, files);
    } catch (err) {
      throw new Error(err);
    }
  }

  public async update(
    postId: string,
    imageURL: string,
    input: UpdateCommunityPostInput,
    file: FileUpload,
    authorId: string,
  ): Promise<UpdateCommunityPostPayload> {
    const post = await this.communityPostRepository.findPostByCreatorId(
      authorId,
      postId,
    );
    if (!post) {
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
    const community = await this.communityRepository.getCommunityById(
      post.communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const followedCompany =
      await this.followCompanyService.checkIfUserFollowCompany(
        community.companyId,
        authorId,
      );
    if (!followedCompany)
      return customError(
        COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
        COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
        STATUS_CODE.BAD_CONFLICT,
      );
    const checkMember =
      await this.communityRepository.checkCommunityMemberExist(
        community.id,
        authorId,
      );
    if (!checkMember)
      return customError(
        COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
        COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
        STATUS_CODE.BAD_REQUEST_EXCEPTION,
      );
    return await this.communityPostRepository.update(
      postId,
      imageURL,
      input,
      file,
      post,
    );
  }
  public async delete(
    postId: string,
    userId: string,
  ): Promise<DeleteCommunityPostPayload> {
    const post = await this.communityPostRepository.findPostByCreatorId(
      userId,
      postId,
    );
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const community = await this.communityRepository.getCommunityById(
      post.communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const checkOwner = await this.communityPostRepository.checkOwner(
      postId,
      userId,
    );
    if (checkOwner) return await this.communityPostRepository.delete(postId);
    const followedCompany =
      await this.followCompanyService.checkIfUserFollowCompany(
        community.companyId,
        userId,
      );
    if (!followedCompany)
      return customError(
        COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
        COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
        STATUS_CODE.BAD_CONFLICT,
      );
    const checkMember =
      await this.communityRepository.checkCommunityMemberExist(
        community.id,
        userId,
      );
    if (!checkMember)
      return customError(
        COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
        COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
        STATUS_CODE.BAD_REQUEST_EXCEPTION,
      );
    return await this.communityPostRepository.delete(post.id);
  }
}
