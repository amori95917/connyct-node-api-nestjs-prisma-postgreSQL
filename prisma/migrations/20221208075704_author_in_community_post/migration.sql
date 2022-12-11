/*
  Warnings:

  - You are about to drop the column `authorId` on the `CommunityPostMedia` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `CommunityPostMedia` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `CommunityPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `CommunityPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommunityPostMedia" DROP CONSTRAINT "CommunityPostMedia_authorId_fkey";

-- DropIndex
DROP INDEX "CommunityPost_communityId_idx";

-- DropIndex
DROP INDEX "CommunityPostMedia_communityPostId_authorId_idx";

-- AlterTable
ALTER TABLE "CommunityPost" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CommunityPostMedia" DROP COLUMN "authorId",
DROP COLUMN "isDeleted";

-- CreateIndex
CREATE INDEX "CommunityPost_communityId_authorId_idx" ON "CommunityPost"("communityId", "authorId");

-- CreateIndex
CREATE INDEX "CommunityPostMedia_communityPostId_idx" ON "CommunityPostMedia"("communityPostId");

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
