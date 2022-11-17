/*
  Warnings:

  - Added the required column `discussionId` to the `DiscussionAnswerVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscussionAnswerVote" ADD COLUMN     "discussionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscussionAnswerVote" ADD CONSTRAINT "DiscussionAnswerVote_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "CompanyDiscussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
