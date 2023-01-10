/*
  Warnings:

  - Added the required column `mediaType` to the `ProductMedia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "ProductMedia" ADD COLUMN     "mediaType" "MediaType" NOT NULL;
