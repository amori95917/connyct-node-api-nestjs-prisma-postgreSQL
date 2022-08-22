-- CreateIndex
CREATE INDEX "PostReaction_postId_reactionId_userId_idx" ON "PostReaction"("postId", "reactionId", "userId");
