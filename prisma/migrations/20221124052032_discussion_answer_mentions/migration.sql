-- CreateTable
CREATE TABLE "DiscussionAnswerMentions" (
    "id" TEXT NOT NULL,
    "mentionId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "DiscussionAnswerMentions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscussionAnswerMentions" ADD CONSTRAINT "DiscussionAnswerMentions_mentionId_fkey" FOREIGN KEY ("mentionId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionAnswerMentions" ADD CONSTRAINT "DiscussionAnswerMentions_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "DiscussionAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
