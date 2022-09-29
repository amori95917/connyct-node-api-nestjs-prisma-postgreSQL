/*
  Warnings:

  - You are about to drop the column `image` on the `PostImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostImage" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT;
