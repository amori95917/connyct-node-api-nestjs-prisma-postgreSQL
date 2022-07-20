import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { IndustryInput } from '../dto/industry.dto';
import { Industry } from '../industry.models';

@Injectable()
export class IndustryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllIndustry(): Promise<Industry[]> {
    try {
      const industry = await this.prisma.industry.findMany({
        where: { isActive: true },
      });
      return industry;
    } catch (e) {
      throw new Error(e);
    }
  }
  async findOneUniqueIndustry(type: string): Promise<Industry> {
    try {
      return await this.prisma.industry.findUnique({
        where: { type },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  async findOneById(id: string): Promise<Industry> {
    try {
      return await this.prisma.industry.findFirst({ where: { id } });
    } catch (e) {
      throw new Error(e);
    }
  }
  async createIndustry(data: IndustryInput): Promise<Industry> {
    try {
      // TODO: pirorityOrder must be assign
      const newIndustry = await this.prisma.industry.create({
        data: {
          type: data.type,
          description: data.description,
        },
      });
      return newIndustry;
    } catch (e) {
      throw new Error(e);
    }
  }
  async updateIndustry(
    id: string,
    updateIndustry: IndustryInput,
  ): Promise<Industry> {
    try {
      return await this.prisma.industry.update({
        where: { id: id },
        data: {
          type: updateIndustry.type,
          description: updateIndustry.description,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  async deleteIndustry(id: string): Promise<Industry> {
    try {
      return await this.prisma.industry.delete({ where: { id } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async activeOrDeactiveIndustry(
    id: string,
    isActive: boolean,
  ): Promise<Industry> {
    try {
      return await this.prisma.industry.update({
        where: { id },
        data: { isActive: !isActive },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
