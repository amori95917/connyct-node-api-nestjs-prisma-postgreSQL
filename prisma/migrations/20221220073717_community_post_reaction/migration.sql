-- CreateEnum
CREATE TYPE "ReactionsType" AS ENUM ('LIKE', 'USEFUL', 'PRAISE', 'AAPPRECIATION', 'INSIGHTFUL', 'CURIOUS', 'DISGUSTING');

-- CreateTable
CREATE TABLE "CommunityPostReaction" (
    "id" TEXT NOT NULL,
    "reactions" "ReactionsType" NOT NULL,
    "communityPostId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    "postId" TEXT,

    CONSTRAINT "CommunityPostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityPostReaction_communityPostId_userId_idx" ON "CommunityPostReaction"("communityPostId", "userId");

-- AddForeignKey
ALTER TABLE "CommunityPostReaction" ADD CONSTRAINT "CommunityPostReaction_communityPostId_fkey" FOREIGN KEY ("communityPostId") REFERENCES "CommunityPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPostReaction" ADD CONSTRAINT "CommunityPostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPostReaction" ADD CONSTRAINT "CommunityPostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
