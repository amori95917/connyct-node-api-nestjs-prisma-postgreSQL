/*
  Warnings:

  - You are about to drop the column `categoryType` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comparePrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropIndex
DROP INDEX "ProductCategory_categoryType_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "comparePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "costPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "categoryType",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductImage";

-- CreateTable
CREATE TABLE "ProductMedia" (
    "id" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- AddForeignKey
ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
