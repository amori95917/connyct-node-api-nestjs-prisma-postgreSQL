/*
  Warnings:

  - A unique constraint covering the columns `[reactionType]` on the table `Reactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reactions_reactionType_key" ON "Reactions"("reactionType");
