-- CreateTable
CREATE TABLE "CompanyDocument" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "CompanyDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyDocument" ADD CONSTRAINT "CompanyDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
