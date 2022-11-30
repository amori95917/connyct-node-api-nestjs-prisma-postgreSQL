import { Injectable } from '@nestjs/common';
import { CommunityRole } from '@prisma/client';
import { FileUpload } from 'graphql-upload';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import {
  CommunityDeletePayload,
  CommunityPayload,
  GetCommunityPayload,
} from '../entities/community-payload';
import { Community } from '../entities/community.entity';

@Injectable()
export class CommunityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getCommunityByCompanyId(
    companyId: string,
  ): Promise<GetCommunityPayload> {
    try {
      const community = await this.prisma.companyCommunity.findMany({
        where: { companyId },
      });
      return { community };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCommunityById(id: string): Promise<Community> {
    return await this.prisma.companyCommunity.findFirst({ where: { id } });
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
    userId: string,
  ): Promise<CommunityPayload> {
    try {
      const profileUrl = await this.fileUploadService.uploadImage(
        'community/community-profile',
        profile,
      );
      if (profileUrl.errors) return { errors: profileUrl.errors };
      const create = await this.prisma.$transaction(async () => {
        const community = await this.prisma.companyCommunity.create({
          data: {
            ...input,
            creatorId: userId,
            profile: profileUrl,
            slug: this.generateSlug(input.name),
          },
        });

        const communityRole = await this.prisma.companyCommunityRole.create({
          data: {
            role: CommunityRole.ADMIN,
            userId,
            communityId: community.id,
          },
        });
        return {
          community,
          communityRole,
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
  ): Promise<CommunityPayload> {
    try {
      const community = await this.prisma.$transaction(async () => {
        let updatedProfileUrl: any;
        if (profile) {
          await this.fileUploadService.deleteImage(
            'community/community-profile',
            await this.cloudinary.getPublicId(communityData.profile),
          );
          updatedProfileUrl = await this.fileUploadService.uploadImage(
            'community/community-profile',
            profile,
          );
          if (updatedProfileUrl.errors)
            return { errors: updatedProfileUrl.errors };
        }
        const updateCommunity = await this.prisma.companyCommunity.update({
          where: { id },
          data: {
            ...communityData,
            ...input,
            slug: this.generateSlug(input.name),
            profile: updatedProfileUrl,
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
  ): Promise<CommunityDeletePayload> {
    try {
      const deleteCommunity = await this.prisma.$transaction(async () => {
        await this.fileUploadService.deleteImage(
          'community/community-profile',
          await this.cloudinary.getPublicId(profile),
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
}
