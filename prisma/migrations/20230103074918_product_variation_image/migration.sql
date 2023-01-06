/*
  Warnings:

  - You are about to drop the column `productImageId` on the `ProductVariationImage` table. All the data in the column will be lost.
  - Made the column `productVariationId` on table `ProductVariationAttribute` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `image` to the `ProductVariationImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariationImage" DROP CONSTRAINT "ProductVariationImage_productImageId_fkey";

-- DropIndex
DROP INDEX "ProductVariationAttribute_productVariationId_key";

-- AlterTable
ALTER TABLE "ProductType" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP;

-- AlterTable
ALTER TABLE "ProductVariationAttribute" ALTER COLUMN "productVariationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariationImage" DROP COLUMN "productImageId",
ADD COLUMN     "image" TEXT NOT NULL;
