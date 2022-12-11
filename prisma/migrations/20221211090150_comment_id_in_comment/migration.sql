/*
  Warnings:

  - You are about to drop the column `communityCommentId` on the `CommunityComment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityComment" DROP CONSTRAINT "CommunityComment_communityCommentId_fkey";

-- DropIndex
DROP INDEX "CommunityComment_communityPostId_communityCommentId_idx";

-- AlterTable
ALTER TABLE "CommunityComment" DROP COLUMN "communityCommentId",
ADD COLUMN     "commentId" TEXT;

-- CreateIndex
CREATE INDEX "CommunityComment_communityPostId_commentId_idx" ON "CommunityComment"("communityPostId", "commentId");

-- AddForeignKey
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommunityComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
