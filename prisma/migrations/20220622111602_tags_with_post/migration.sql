/*
  Warnings:

  - You are about to drop the `PostWithProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostWithProduct" DROP CONSTRAINT "PostWithProduct_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostWithProduct" DROP CONSTRAINT "PostWithProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "postId" TEXT NOT NULL;

-- DropTable
DROP TABLE "PostWithProduct";

-- DropTable
DROP TABLE "_PostToTag";

-- CreateTable
CREATE TABLE "TagWithPost" (
    "id" TEXT NOT NULL,
    "tagsId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "TagWithPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TagWithPost" ADD CONSTRAINT "TagWithPost_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagWithPost" ADD CONSTRAINT "TagWithPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
