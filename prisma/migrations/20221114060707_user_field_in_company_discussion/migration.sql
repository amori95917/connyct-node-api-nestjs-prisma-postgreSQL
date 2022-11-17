/*
  Warnings:

  - Added the required column `userId` to the `CompanyDiscussions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyDiscussions" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CompanyDiscussions" ADD CONSTRAINT "CompanyDiscussions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
