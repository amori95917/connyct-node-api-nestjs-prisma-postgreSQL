/*
  Warnings:

  - You are about to drop the column `postId` on the `CommunityPostReaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityPostReaction" DROP CONSTRAINT "CommunityPostReaction_postId_fkey";

-- AlterTable
ALTER TABLE "CommunityPostReaction" DROP COLUMN "postId";

-- CreateTable
CREATE TABLE "CommunityPostCommentReaction" (
    "id" TEXT NOT NULL,
    "reactions" "ReactionsType" NOT NULL,
    "communityPostCommentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "CommunityPostCommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityPostCommentReaction_communityPostCommentId_idx" ON "CommunityPostCommentReaction"("communityPostCommentId");

-- AddForeignKey
ALTER TABLE "CommunityPostCommentReaction" ADD CONSTRAINT "CommunityPostCommentReaction_communityPostCommentId_fkey" FOREIGN KEY ("communityPostCommentId") REFERENCES "CommunityComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPostCommentReaction" ADD CONSTRAINT "CommunityPostCommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
