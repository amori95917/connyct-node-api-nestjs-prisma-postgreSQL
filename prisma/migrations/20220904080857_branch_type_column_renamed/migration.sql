/*
  Warnings:

  - You are about to drop the column `type` on the `Branch` table. All the data in the column will be lost.
  - Added the required column `branch_type` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "type",
ADD COLUMN     "branch_type" "BranchType" NOT NULL;
