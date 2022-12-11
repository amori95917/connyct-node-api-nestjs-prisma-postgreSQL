/*
  Warnings:

  - Made the column `postId` on table `PostImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommunityComment" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP;

-- AlterTable
ALTER TABLE "CommunityPost" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP;

-- AlterTable
ALTER TABLE "PostImage" ALTER COLUMN "postId" SET NOT NULL;

-- CreateTable
CREATE TABLE "CommunityPostMedia" (
    "id" TEXT NOT NULL,
    "metaTitle" TEXT,
    "imageURL" TEXT,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "communityPostId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "CommunityPostMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityPostMedia_imageURL_key" ON "CommunityPostMedia"("imageURL");

-- CreateIndex
CREATE INDEX "CommunityPostMedia_communityPostId_authorId_idx" ON "CommunityPostMedia"("communityPostId", "authorId");

-- CreateIndex
CREATE INDEX "CommunityComment_communityPostId_communityCommentId_idx" ON "CommunityComment"("communityPostId", "communityCommentId");

-- CreateIndex
CREATE INDEX "CommunityPost_communityId_idx" ON "CommunityPost"("communityId");

-- AddForeignKey
ALTER TABLE "CommunityPostMedia" ADD CONSTRAINT "CommunityPostMedia_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPostMedia" ADD CONSTRAINT "CommunityPostMedia_communityPostId_fkey" FOREIGN KEY ("communityPostId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
