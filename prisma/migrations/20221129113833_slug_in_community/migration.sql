/*
  Warnings:

  - Added the required column `profile` to the `CompanyCommunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `CompanyCommunity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CompanyCommunity_name_key";

-- AlterTable
ALTER TABLE "CompanyCommunity" ADD COLUMN     "profile" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;
