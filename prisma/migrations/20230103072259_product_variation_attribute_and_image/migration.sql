/*
  Warnings:

  - You are about to drop the column `benefits` on the `ProductAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `productVariationId` on the `ProductAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `productVariationId` on the `ProductImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productVariationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productVariationId_fkey";

-- DropIndex
DROP INDEX "ProductAttribute_productVariationId_key";

-- AlterTable
ALTER TABLE "ProductAttribute" DROP COLUMN "benefits",
DROP COLUMN "productVariationId";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "productVariationId";

-- CreateTable
CREATE TABLE "ProductVariationImage" (
    "id" TEXT NOT NULL,
    "productImageId" TEXT,
    "productVariationId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "ProductVariationImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariationAttribute" (
    "id" TEXT NOT NULL,
    "productAttributeId" TEXT NOT NULL,
    "productVariationId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "ProductVariationAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariationAttribute_productVariationId_key" ON "ProductVariationAttribute"("productVariationId");

-- AddForeignKey
ALTER TABLE "ProductVariationImage" ADD CONSTRAINT "ProductVariationImage_productImageId_fkey" FOREIGN KEY ("productImageId") REFERENCES "ProductImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariationImage" ADD CONSTRAINT "ProductVariationImage_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariationAttribute" ADD CONSTRAINT "ProductVariationAttribute_productAttributeId_fkey" FOREIGN KEY ("productAttributeId") REFERENCES "ProductAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariationAttribute" ADD CONSTRAINT "ProductVariationAttribute_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
