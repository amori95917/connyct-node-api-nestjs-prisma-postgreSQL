import { Field, InputType } from '@nestjs/graphql';
import { MediaType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class ProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  productName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  sku: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field({ nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  comparePrice: number;

  @Field({ nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  costPrice: number;
}
@InputType()
export class ProductEditInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  productName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  sku: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  price: number;

  @Field({ nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  comparePrice: number;

  @Field({ nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  costPrice: number;
}

@InputType()
export class ProductMediaInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(MediaType)
  mediaType: MediaType;
}
@InputType()
export class ProductMediaEditInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(MediaType)
  mediaType: MediaType;
}
@InputType()
export class ProductAttributeInput {
  @Field()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUUID()
  productVariationId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  specification: string;
}
@InputType()
export class ProductVariationInput {
  @Field()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  size: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  color: string;
}

@InputType()
export class ProductTypeInput {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
@InputType()
export class ProductTypeEditInput {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
