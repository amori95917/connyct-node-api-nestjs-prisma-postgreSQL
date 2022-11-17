/*
  Warnings:

  - Added the required column `repliedToAnswerId` to the `DiscussionAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscussionAnswer" ADD COLUMN     "repliedToAnswerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscussionAnswer" ADD CONSTRAINT "DiscussionAnswer_repliedToAnswerId_fkey" FOREIGN KEY ("repliedToAnswerId") REFERENCES "DiscussionAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
