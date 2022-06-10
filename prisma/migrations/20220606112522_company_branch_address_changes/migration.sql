/*
  Warnings:

  - You are about to drop the column `address1` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `branches` on the `Company` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_companyId_fkey";

-- DropIndex
DROP INDEX "Address_companyId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "address1",
DROP COLUMN "address2",
DROP COLUMN "companyId",
ADD COLUMN     "branchId" TEXT,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "branches",
ADD COLUMN     "addresses" JSONB,
ADD COLUMN     "contactEmail" TEXT;

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    "companyId" TEXT,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
