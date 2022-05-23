/*
  Warnings:

  - You are about to drop the column `votes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `votes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `CommentVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostVote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RatingStatus" AS ENUM ('NEUTRAL', 'UPVOTED', 'DOWNVOTED');

-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostVote" DROP CONSTRAINT "PostVote_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostVote" DROP CONSTRAINT "PostVote_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "votes",
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
DROP COLUMN "votes",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "CommentVote";

-- DropTable
DROP TABLE "PostVote";

-- DropEnum
DROP TYPE "VotingStatus";

-- CreateTable
CREATE TABLE "PostRating" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "rating" "RatingStatus" NOT NULL
);

-- CreateTable
CREATE TABLE "CommentRating" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "rating" "RatingStatus" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PostRating_userId_postId_key" ON "PostRating"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentRating_userId_commentId_key" ON "CommentRating"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD CONSTRAINT "CommentRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD CONSTRAINT "CommentRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
