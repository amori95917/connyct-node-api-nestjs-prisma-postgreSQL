/*
  Warnings:

  - Changed the type of `sku` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sku` on the `ProductVariation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sku",
ADD COLUMN     "sku" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariation" DROP COLUMN "sku",
ADD COLUMN     "sku" DOUBLE PRECISION NOT NULL;
