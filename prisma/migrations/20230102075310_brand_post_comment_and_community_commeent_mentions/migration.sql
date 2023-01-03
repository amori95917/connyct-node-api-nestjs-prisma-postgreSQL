/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `repliedToCommentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `repliedToReplyId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_repliedToCommentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_repliedToReplyId_fkey";

-- DropIndex
DROP INDEX "Comment_postId_repliedToCommentId_repliedToReplyId_creatorI_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "creatorId",
DROP COLUMN "rating",
DROP COLUMN "repliedToCommentId",
DROP COLUMN "repliedToReplyId",
DROP COLUMN "text",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "content" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CommunityPostCommentMentions" (
    "id" TEXT NOT NULL,
    "mentionId" TEXT,
    "commentId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "CommunityPostCommentMentions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_postId_commentId_idx" ON "Comment"("postId", "commentId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPostCommentMentions" ADD CONSTRAINT "CommunityPostCommentMentions_mentionId_fkey" FOREIGN KEY ("mentionId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPostCommentMentions" ADD CONSTRAINT "CommunityPostCommentMentions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommunityComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
