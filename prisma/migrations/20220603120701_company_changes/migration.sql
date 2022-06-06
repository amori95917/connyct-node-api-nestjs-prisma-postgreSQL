/*
  Warnings:

  - Made the column `branches` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "branches" SET NOT NULL;
