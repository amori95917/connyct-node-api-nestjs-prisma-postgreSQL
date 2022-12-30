import { Injectable } from '@nestjs/common';
import {
  CommunityRole,
  CommunityType,
  FollowUnfollowCompany,
} from '@prisma/client';
import { FileUpload } from 'graphql-upload';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import {
  CommunityMemberInput,
  CommunityMemberInviteInput,
} from '../dto/community-member.input';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import { OrderListCommunityMember } from '../dto/order-community-members.input';
import { OrderListCommunity } from '../dto/order-community.input';
import {
  CommunityPolicyInput,
  CommunityPolicyUpdateInput,
} from '../dto/policy.input';
import { CommunityMember } from '../entities/community-member.entity';
import {
  AcceptInvitePayload,
  CommunityMemberPayload,
  JoinCommunityPayload,
} from '../entities/community-member.payload';
import {
  CommunityDeletePayload,
  CommunityPayload,
} from '../entities/community-payload';
import { Community } from '../entities/community.entity';
import {
  CommunityPolicyPayload,
  CommunityPolicyDeletePayload,
} from '../entities/policy.payload';

@Injectable()
export class CommunityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findCommunityByIds(ids: string[]) {
    return await this.prisma.companyCommunity.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async getCommunityByCompanyId(
    companyId: string,
    paginate: ConnectionArgs,
    order: OrderListCommunity,
    userId?: string,
  ) {
    try {
      const communityIds = await this.prisma.communityMember
        .findMany({
          where: {
            AND: [{ companyId }, { memberId: userId }, { isAccepted: true }],
          },
          select: { communityId: true },
        })
        .then((communityMembers) =>
          communityMembers.map((cm) => cm.communityId),
        );
      const queryWhereClause = userId
        ? {
            AND: [
              { companyId },
              {
                OR: [{ id: { in: communityIds } }, { type: 'PUBLIC' as const }],
              },
            ],
          }
        : { companyId };
      const communities = await findManyCursorConnection(
        (args) =>
          this.prisma.companyCommunity.findMany({
            ...args,
            // where: { companyId },
            where: queryWhereClause,
            orderBy: { [order.orderBy]: order.direction },
          }),
        () =>
          this.prisma.companyCommunity.count({
            // where: { companyId },
            where: queryWhereClause,
          }),
        { ...paginate },
      );
      return {
        community: {
          ...communities,
          edges: communities.edges.map((edge) => ({
            ...edge,
            node: {
              ...edge.node,
              isConnected: communityIds.includes(edge.node.id),
            },
          })),
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async memberRole(userId: string) {
    return await this.prisma.companyCommunityRole.findFirst({
      where: { userId },
    });
  }
  async getCommunityById(id: string): Promise<Community> {
    return await this.prisma.companyCommunity.findFirst({ where: { id } });
  }

  async getCommunityFollowersCount(communityId: string) {
    try {
      return await this.prisma.communityMember.count({
        where: { communityId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
  async getCommunityByIdAndUserId(
    id: string,
    creatorId: string,
  ): Promise<Community> {
    return await this.prisma.companyCommunity.findFirst({
      where: { id, creatorId },
    });
  }

  generateSlug(name: string) {
    const slug = name.replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '');
    const result = Date.now().toString(36);
    return (slug + result).toLowerCase();
  }

  async insertFollowersInBatches(
    followers: FollowUnfollowCompany[],
    community: Community,
    companyId: string,
  ) {
    const batchSize = 1000; // Number of followers to insert in each batch
    let currentIndex = 0; // Current index in the followers array

    while (currentIndex < followers.length) {
      // Get the next batch of followers
      const batch = followers.slice(currentIndex, currentIndex + batchSize);

      // Insert the batch of followers
      await this.prisma.communityMember.createMany({
        data: batch.map((follower) => ({
          communityId: community.id,
          companyId: companyId,
          memberId: follower.followedById,
          isAccepted: true,
        })),
      });

      // Update the current index to the end of the batch
      currentIndex += batchSize;
    }
  }

  async createCommunity(
    input: CommunityInput,
    profile: FileUpload,
    coverImage: FileUpload,
    userId: string,
  ): Promise<CommunityPayload> {
    try {
      // Upload the profile and cover image in parallel
      const [profileUrl, coverImageUrl] = await Promise.all([
        profile
          ? this.fileUploadService.uploadImage(
              'community/community-profile',
              profile,
            )
          : Promise.resolve(),
        coverImage
          ? this.fileUploadService.uploadImage(
              'community/community-coverImage',
              coverImage,
            )
          : Promise.resolve(),
      ]);

      // If any of the image uploads returned errors, return the errors
      if (profileUrl?.errors || coverImageUrl?.errors) {
        return {
          errors: (profileUrl?.errors || []).concat(
            coverImageUrl?.errors || [],
          ),
        };
      }
      console.log('profileImageURL', profileUrl, coverImageUrl);
      const create = await this.prisma.$transaction(async () => {
        const community = await this.prisma.companyCommunity.create({
          data: {
            ...input,
            creatorId: userId,
            profile: profileUrl,
            coverImage: coverImageUrl,
            slug: this.generateSlug(input.name),
          },
        });
        if (input.type === 'PUBLIC') {
          const companyFollowers =
            await this.prisma.followUnfollowCompany.findMany({
              where: {
                followedToId: input.companyId,
              },
            });
          // const communityMembers = companyFollowers.map((follower) => ({
          //   communityId: community.id,
          //   companyId: input.companyId,
          //   memberId: follower.followedById,
          //   isAccepted: true,
          // }));
          // await this.prisma.communityMember.createMany({
          //   data: communityMembers,
          // });
          await this.insertFollowersInBatches(
            companyFollowers,
            community,
            input.companyId,
          );
        } else {
          await this.prisma.communityMember.create({
            data: {
              communityId: community.id,
              companyId: input.companyId,
              memberId: userId,
              isAccepted: true,
            },
          });
        }

        await this.prisma.companyCommunityRole.create({
          data: {
            role: CommunityRole.ADMIN,
            userId,
            communityId: community.id,
          },
        });
        return {
          community,
        };
      });
      return { community: create.community };
    } catch (err) {
      throw new Error(err);
    }
  }

  async editCommunity(
    input: CommunityEditInput,
    id: string,
    communityData: any,
    profile: FileUpload,
    coverImage: FileUpload,
  ): Promise<CommunityPayload> {
    try {
      let updatedProfileUrl: any;
      let updatedCoverImageUrl: any;
      const community = await this.prisma.$transaction(async () => {
        if (profile) {
          if (communityData.profile) {
            await this.fileUploadService.deleteImage(
              'community/community-profile',
              await this.cloudinary.getPublicId(communityData.profile),
            );
          }
          updatedProfileUrl = await this.fileUploadService.uploadImage(
            'community/community-profile',
            profile,
          );
          if (updatedProfileUrl.errors)
            return { errors: updatedProfileUrl.errors };
        }
        if (coverImage) {
          if (communityData.coverImage) {
            await this.fileUploadService.deleteImage(
              'community/community-coverImage',
              await this.cloudinary.getPublicId(communityData.coverImage),
            );
          }
          updatedCoverImageUrl = await this.fileUploadService.uploadImage(
            'community/community-coverImage',
            coverImage,
          );
          if (updatedCoverImageUrl.errors)
            return { errors: updatedCoverImageUrl.errors };
        }
        const updateCommunity = await this.prisma.companyCommunity.update({
          where: { id },
          data: {
            ...communityData,
            ...input,
            slug: this.generateSlug(input.name),
            profile: updatedProfileUrl,
            coverImage: updatedCoverImageUrl,
          },
        });
        return { updateCommunity };
      });
      return { community: community.updateCommunity, errors: community.errors };
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteCommunity(
    id: string,
    profile: string,
    coverImage: string,
  ): Promise<CommunityDeletePayload> {
    try {
      const deleteCommunity = await this.prisma.$transaction(async () => {
        await this.fileUploadService.deleteImage(
          'community/community-profile',
          await this.cloudinary.getPublicId(profile),
        );
        await this.fileUploadService.deleteImage(
          'community/community-coverImage',
          await this.cloudinary.getPublicId(coverImage),
        );
        await this.prisma.companyCommunity.delete({
          where: { id },
        });
        return true;
      });
      return { isDeleted: deleteCommunity };
    } catch (err) {
      throw new Error(err);
    }
  }

  async checkCommunityMemberExist(
    communityId: string,
    memberId: string,
  ): Promise<CommunityMember> {
    return await this.prisma.communityMember.findFirst({
      where: { communityId, memberId, isAccepted: true },
    });
  }

  async checkMemberExist(id: string) {
    return await this.prisma.communityMember.findFirst({
      where: { id, isAccepted: true },
    });
  }

  async findPublicCommunity(id: string): Promise<Community> {
    return await this.prisma.companyCommunity.findFirst({
      where: { id, type: CommunityType.PUBLIC },
    });
  }

  async getCommunityMember(
    communityId: string,
    paginate: ConnectionArgs,
    order: OrderListCommunityMember,
  ) {
    try {
      const communityMember = await findManyCursorConnection(
        (args) =>
          this.prisma.communityMember.findMany({
            ...args,
            where: { communityId, isAccepted: true },
            orderBy: { [order.orderBy]: order.direction },
          }),
        () =>
          this.prisma.communityMember.count({
            where: { communityId },
          }),
        { ...paginate },
      );
      return { communityMember };
    } catch (err) {
      throw new Error(err);
    }
  }

  async inviteUser(
    input: CommunityMemberInviteInput,
    invitedById: string,
  ): Promise<CommunityMemberPayload> {
    try {
      const invited = await Promise.all(
        input.memberId.map(async (member) => {
          return await this.prisma.communityMember.create({
            data: {
              communityId: input.communityId,
              companyId: input.companyId,
              memberId: member,
              invitedById,
            },
          });
        }),
      );
      return { communityMember: invited };
    } catch (err) {
      throw new Error(err);
    }
  }

  async acceptCommunityInvite(
    communityMemberId: string,
  ): Promise<AcceptInvitePayload> {
    try {
      await this.prisma.$transaction(async () => {
        const updated = await this.prisma.communityMember.update({
          where: { id: communityMemberId },
          data: {
            isAccepted: true,
          },
        });
        await this.prisma.companyCommunityRole.create({
          data: {
            role: CommunityRole.MEMBER,
            communityId: updated.communityId,
            userId: updated.memberId,
          },
        });
      });
      return { isAccepted: true };
    } catch (err) {
      throw new Error(err);
    }
  }

  async joinPublicCommunity(
    input: CommunityMemberInput,
    memberId: string,
  ): Promise<JoinCommunityPayload> {
    try {
      const joinCommunity = await this.prisma.$transaction(async () => {
        const join = await this.prisma.communityMember.create({
          data: { ...input, memberId, isAccepted: true },
        });
        await this.prisma.companyCommunityRole.create({
          data: {
            role: CommunityRole.MEMBER,
            userId: memberId,
            communityId: input.communityId,
          },
        });
        return join;
      });
      console.log(joinCommunity, 'incoming ');
      return { joinCommunity };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCommunityPolicies(communityId: string, paginate: ConnectionArgs) {
    try {
      const policies = await findManyCursorConnection(
        (args) =>
          this.prisma.communityPolicy.findMany({
            ...args,
            where: { communityId },
          }),
        () =>
          this.prisma.communityPolicy.count({
            where: { communityId },
          }),
        { ...paginate },
      );
      return { data: policies };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCommunityPolicy(policyId: string) {
    try {
      return await this.prisma.communityPolicy.findFirst({
        where: { id: policyId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createCommunityPolicy(
    communityId: string,
    input: CommunityPolicyInput,
  ): Promise<CommunityPolicyPayload> {
    try {
      const communityPolicy = await this.prisma.communityPolicy.create({
        data: { ...input, communityId },
      });
      return { data: communityPolicy };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateCommunityPolicy(
    id: string,
    input: CommunityPolicyUpdateInput,
  ): Promise<CommunityPolicyPayload> {
    const { title, description } = input;
    try {
      const updatePolicy = await this.prisma.communityPolicy.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
        },
      });
      return { data: updatePolicy };
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteCommunityPolicy(
    id: string,
  ): Promise<CommunityPolicyDeletePayload> {
    try {
      await this.prisma.communityPolicy.delete({
        where: { id },
      });
      return { isDeleted: true };
    } catch (err) {
      throw new Error(err);
    }
  }
}
