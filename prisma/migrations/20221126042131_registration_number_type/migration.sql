-- CreateEnum
CREATE TYPE "registrationNumberType" AS ENUM ('PAN', 'VAT');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "registrationNumberType" "registrationNumberType";
