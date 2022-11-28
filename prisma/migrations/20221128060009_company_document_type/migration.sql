/*
  Warnings:

  - The `registrationNumberType` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `CompanyDocument` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RegistrationNumberType" AS ENUM ('PAN', 'VAT');

-- CreateEnum
CREATE TYPE "CompanyDocumentType" AS ENUM ('PAN', 'VAT', 'COMPANY_REGISTRATION', 'TAX_CLEARANCE', 'BANK_CHEQUE', 'TRADEMARK');

-- AlterEnum
ALTER TYPE "AccountStatus" ADD VALUE 'REVIEW';

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "registrationNumberType",
ADD COLUMN     "registrationNumberType" "RegistrationNumberType";

-- AlterTable
ALTER TABLE "CompanyDocument" DROP COLUMN "type",
ADD COLUMN     "type" "CompanyDocumentType" NOT NULL;

-- DropEnum
DROP TYPE "registrationNumberType";
