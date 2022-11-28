/*
  Warnings:

  - The values [CORPORATE] on the enum `BranchType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `street1` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `street2` on the `Branch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contactNumber]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactEmail]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BranchType_new" AS ENUM ('HEADQUATER', 'BRANCH_OFFICE');
ALTER TABLE "Branch" ALTER COLUMN "type" TYPE "BranchType_new" USING ("type"::text::"BranchType_new");
ALTER TYPE "BranchType" RENAME TO "BranchType_old";
ALTER TYPE "BranchType_new" RENAME TO "BranchType";
DROP TYPE "BranchType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "name",
DROP COLUMN "street1",
DROP COLUMN "street2",
ADD COLUMN     "street" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Branch_contactNumber_key" ON "Branch"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_contactEmail_key" ON "Branch"("contactEmail");
