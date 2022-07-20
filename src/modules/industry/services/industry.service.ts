import { Injectable } from '@nestjs/common';
import { IndustryInput } from '../dto/industry.dto';
import { IndustryPayload } from '../entities/industry.entity';
import { Industry } from '../industry.models';
import { IndustryRepository } from '../repository/industry.repository';

@Injectable()
export class IndustryService {
  constructor(private industryRepository: IndustryRepository) {}

  async getIndustry(): Promise<IndustryPayload> {
    const industries = await this.industryRepository.getAllIndustry();
    return {
      industries,
    };
  }
  async createIndustry(data: IndustryInput): Promise<IndustryPayload> {
    const checkIndustry = await this.industryRepository.findOneUniqueIndustry(
      data.type,
    );
    if (checkIndustry) return { error: 'Industry type already exists' };
    const industry = await this.industryRepository.createIndustry(data);
    return { industry };
  }

  async updateIndustry(
    id: string,
    updateIndustry: IndustryInput,
  ): Promise<IndustryPayload> {
    const checkIndustry = await this.industryRepository.findOneById(id);
    if (!checkIndustry) return { error: 'Industry not found' };
    const industry = await this.industryRepository.updateIndustry(
      id,
      updateIndustry,
    );
    return { industry };
  }

  async deleteIndustry(id: string): Promise<IndustryPayload> {
    const checkIndustry = await this.industryRepository.findOneById(id);
    if (!checkIndustry) return { error: 'Industry not found' };
    await this.industryRepository.deleteIndustry(id);
    return { isDeletedSuccessful: true };
  }

  async activeOrDeactiveIndustry(id: string): Promise<IndustryPayload> {
    const checkIndustry = await this.industryRepository.findOneById(id);
    if (!checkIndustry) return { error: 'Industry not found' };
    const industry = await this.industryRepository.activeOrDeactiveIndustry(
      id,
      checkIndustry.isActive,
    );
    return { industry };
  }
}
