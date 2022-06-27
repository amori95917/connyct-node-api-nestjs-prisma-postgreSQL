/*
  Warnings:

  - You are about to drop the column `productId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_productId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PostWithProduct" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "PostWithProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostWithProduct" ADD CONSTRAINT "PostWithProduct_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostWithProduct" ADD CONSTRAINT "PostWithProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
