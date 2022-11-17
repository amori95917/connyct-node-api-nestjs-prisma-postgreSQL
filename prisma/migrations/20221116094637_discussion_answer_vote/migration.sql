/*
  Warnings:

  - You are about to drop the column `downVote` on the `DiscussionVote` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `DiscussionVote` table. All the data in the column will be lost.
  - Added the required column `vote` to the `DiscussionVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscussionVote" DROP COLUMN "downVote",
DROP COLUMN "upvote",
ADD COLUMN     "vote" "Vote" NOT NULL;

-- CreateTable
CREATE TABLE "DiscussionAnswerVote" (
    "id" TEXT NOT NULL,
    "vote" "Vote" NOT NULL,
    "discussionAnswerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "DiscussionAnswerVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscussionAnswerVote" ADD CONSTRAINT "DiscussionAnswerVote_discussionAnswerId_fkey" FOREIGN KEY ("discussionAnswerId") REFERENCES "DiscussionAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionAnswerVote" ADD CONSTRAINT "DiscussionAnswerVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
