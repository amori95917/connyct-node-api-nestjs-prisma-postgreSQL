/*
  Warnings:

  - You are about to drop the column `image` on the `CompanyDiscussions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyDiscussions" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "DiscussionAnswer" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DiscussionAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscussionAnswer" ADD CONSTRAINT "DiscussionAnswer_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "CompanyDiscussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionAnswer" ADD CONSTRAINT "DiscussionAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
