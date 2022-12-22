import { Injectable } from '@nestjs/common';
import { CommunityRole, CommunityType } from '@prisma/client';
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
  ) {
    try {
      const community = await findManyCursorConnection(
        (args) =>
          this.prisma.companyCommunity.findMany({
            ...args,
            where: { companyId },
            orderBy: { [order.orderBy]: order.direction },
          }),
        () =>
          this.prisma.companyCommunity.count({
            where: { companyId },
          }),
        { ...paginate },
      );
      return { community };
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

  async createCommunity(
    input: CommunityInput,
    profile: FileUpload,
    coverImage: FileUpload,
    userId: string,
  ): Promise<CommunityPayload> {
    try {
      let profileUrl: any;
      let coverImageUrl: any;
      if (profile) {
        profileUrl = await this.fileUploadService.uploadImage(
          'community/community-profile',
          profile,
        );
        if (profileUrl.errors) return { errors: profileUrl.errors };
      }
      if (coverImage) {
        coverImageUrl = await this.fileUploadService.uploadImage(
          'community/community-coverImage',
          coverImage,
        );
        if (coverImageUrl.errors) return { errors: coverImageUrl.errors };
      }
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
        await this.prisma.communityMember.create({
          data: {
            communityId: community.id,
            companyId: input.companyId,
            memberId: userId,
            isAccepted: true,
          },
        });
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
