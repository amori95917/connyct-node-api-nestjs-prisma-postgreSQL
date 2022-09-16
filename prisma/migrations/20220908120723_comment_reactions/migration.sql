-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_repliedToCommentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_repliedToReplyId_fkey";

-- DropForeignKey
ALTER TABLE "CommentMentions" DROP CONSTRAINT "CommentMentions_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentMentions" DROP CONSTRAINT "CommentMentions_mentionId_fkey";

-- CreateTable
CREATE TABLE "CommentReactions" (
    "id" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "CommentReactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_repliedToCommentId_fkey" FOREIGN KEY ("repliedToCommentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_repliedToReplyId_fkey" FOREIGN KEY ("repliedToReplyId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentMentions" ADD CONSTRAINT "CommentMentions_mentionId_fkey" FOREIGN KEY ("mentionId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentMentions" ADD CONSTRAINT "CommentMentions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReactions" ADD CONSTRAINT "CommentReactions_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReactions" ADD CONSTRAINT "CommentReactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
