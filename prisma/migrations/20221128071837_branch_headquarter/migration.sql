/*
  Warnings:

  - The values [HEADQUATER] on the enum `BranchType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BranchType_new" AS ENUM ('HEADQUARTER', 'BRANCH_OFFICE');
ALTER TABLE "Branch" ALTER COLUMN "type" TYPE "BranchType_new" USING ("type"::text::"BranchType_new");
ALTER TYPE "BranchType" RENAME TO "BranchType_old";
ALTER TYPE "BranchType_new" RENAME TO "BranchType";
DROP TYPE "BranchType_old";
COMMIT;
