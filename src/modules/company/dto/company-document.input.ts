import { Field, InputType } from '@nestjs/graphql';
import { CompanyDocumentType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CompanyDocumentInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(CompanyDocumentType)
  type: CompanyDocumentType;
}
@InputType()
export class CompanyDocumentEditInput {
  @Field()
  @IsOptional()
  @IsEnum(CompanyDocumentType)
  type: CompanyDocumentType;
}
