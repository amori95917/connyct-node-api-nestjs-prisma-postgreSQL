-- AlterTable
ALTER TABLE "Branch" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "street1" DROP NOT NULL,
ALTER COLUMN "street2" DROP NOT NULL;
