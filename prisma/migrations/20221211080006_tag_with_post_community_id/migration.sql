-- DropForeignKey
ALTER TABLE "TagWithPost" DROP CONSTRAINT "TagWithPost_postId_fkey";

-- AlterTable
ALTER TABLE "TagWithPost" ADD COLUMN     "communityPostId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TagWithPost" ADD CONSTRAINT "TagWithPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagWithPost" ADD CONSTRAINT "TagWithPost_communityPostId_fkey" FOREIGN KEY ("communityPostId") REFERENCES "CommunityPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
