/*
  Warnings:

  - You are about to drop the `FollowUnfollow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FollowUnfollow" DROP CONSTRAINT "FollowUnfollow_followedById_fkey";

-- DropForeignKey
ALTER TABLE "FollowUnfollow" DROP CONSTRAINT "FollowUnfollow_followedToId_fkey";

-- DropTable
DROP TABLE "FollowUnfollow";

-- CreateTable
CREATE TABLE "FollowUnfollowCompany" (
    "id" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,
    "followedToId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "FollowUnfollowCompany_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FollowUnfollowCompany" ADD CONSTRAINT "FollowUnfollowCompany_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUnfollowCompany" ADD CONSTRAINT "FollowUnfollowCompany_followedToId_fkey" FOREIGN KEY ("followedToId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
