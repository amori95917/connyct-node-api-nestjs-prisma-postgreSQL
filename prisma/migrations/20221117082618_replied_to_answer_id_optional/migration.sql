-- DropForeignKey
ALTER TABLE "DiscussionAnswer" DROP CONSTRAINT "DiscussionAnswer_repliedToAnswerId_fkey";

-- AlterTable
ALTER TABLE "DiscussionAnswer" ALTER COLUMN "repliedToAnswerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscussionAnswer" ADD CONSTRAINT "DiscussionAnswer_repliedToAnswerId_fkey" FOREIGN KEY ("repliedToAnswerId") REFERENCES "DiscussionAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
