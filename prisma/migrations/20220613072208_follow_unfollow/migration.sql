/*
  Warnings:

  - A unique constraint covering the columns `[invitedEmail]` on the table `InvitedEmployee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FollowUnfollow" (
    "id" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,
    "followedToId" TEXT NOT NULL,

    CONSTRAINT "FollowUnfollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvitedEmployee_invitedEmail_key" ON "InvitedEmployee"("invitedEmail");

-- AddForeignKey
ALTER TABLE "FollowUnfollow" ADD CONSTRAINT "FollowUnfollow_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUnfollow" ADD CONSTRAINT "FollowUnfollow_followedToId_fkey" FOREIGN KEY ("followedToId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
