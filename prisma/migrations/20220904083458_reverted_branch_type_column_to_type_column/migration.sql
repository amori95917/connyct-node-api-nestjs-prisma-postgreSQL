/*
  Warnings:

  - You are about to drop the column `branch_type` on the `Branch` table. All the data in the column will be lost.
  - Added the required column `type` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "branch_type",
ADD COLUMN     "type" "BranchType" NOT NULL;
