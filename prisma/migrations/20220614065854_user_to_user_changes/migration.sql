/*
  Warnings:

  - You are about to drop the column `commonCompanyId` on the `FollowUserToUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FollowUserToUser" DROP CONSTRAINT "FollowUserToUser_commonCompanyId_fkey";

-- AlterTable
ALTER TABLE "FollowUserToUser" DROP COLUMN "commonCompanyId";
