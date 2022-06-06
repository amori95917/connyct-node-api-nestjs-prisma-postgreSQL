-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_companyId_fkey";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
