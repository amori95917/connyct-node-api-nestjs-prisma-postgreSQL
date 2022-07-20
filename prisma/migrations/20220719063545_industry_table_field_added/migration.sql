-- AlterTable
ALTER TABLE "Industry" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
