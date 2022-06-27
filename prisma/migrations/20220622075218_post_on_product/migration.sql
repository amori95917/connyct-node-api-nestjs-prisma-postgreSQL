/*
  Warnings:

  - You are about to drop the column `postId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "postId";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
