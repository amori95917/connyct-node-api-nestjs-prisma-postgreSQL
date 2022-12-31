-- AlterTable
ALTER TABLE "CommunityMember" ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FollowUnfollowCompany" ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "FollowUserToUser" ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT true;
