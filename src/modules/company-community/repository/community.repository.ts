import { Injectable } from '@nestjs/common';
import { CommunityRole } from '@prisma/client';
import { FileUpload } from 'graphql-upload';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import {
  CommunityPayload,
  GetCommunityPayload,
} from '../entities/community-payload';
import { Community } from '../entities/community.entity';

@Injectable()
export class CommunityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
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
  ): Promise<CommunityPayload> {
    try {
      const update = await this.prisma.companyCommunity.update({
        where: { id },
        data: {
          ...input,
        },
      });
      return { community: update };
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.companyCommunity.delete({ where: { id } });
    } catch (err) {
      throw new Error(err);
    }
  }
}
