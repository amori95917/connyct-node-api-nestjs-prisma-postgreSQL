/*
  Warnings:

  - Made the column `isActive` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "companyStage" DROP NOT NULL,
ALTER COLUMN "ownership" DROP NOT NULL,
ALTER COLUMN "isActive" SET NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT false;
