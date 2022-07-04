-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyEmployee" DROP CONSTRAINT "CompanyEmployee_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyEmployee" DROP CONSTRAINT "CompanyEmployee_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "FollowUnfollowCompany" DROP CONSTRAINT "FollowUnfollowCompany_followedById_fkey";

-- DropForeignKey
ALTER TABLE "FollowUnfollowCompany" DROP CONSTRAINT "FollowUnfollowCompany_followedToId_fkey";

-- DropForeignKey
ALTER TABLE "FollowUserToUser" DROP CONSTRAINT "FollowUserToUser_followedById_fkey";

-- DropForeignKey
ALTER TABLE "FollowUserToUser" DROP CONSTRAINT "FollowUserToUser_followedToId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyEmployee" ADD CONSTRAINT "CompanyEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyEmployee" ADD CONSTRAINT "CompanyEmployee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUnfollowCompany" ADD CONSTRAINT "FollowUnfollowCompany_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUnfollowCompany" ADD CONSTRAINT "FollowUnfollowCompany_followedToId_fkey" FOREIGN KEY ("followedToId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUserToUser" ADD CONSTRAINT "FollowUserToUser_followedToId_fkey" FOREIGN KEY ("followedToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUserToUser" ADD CONSTRAINT "FollowUserToUser_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
