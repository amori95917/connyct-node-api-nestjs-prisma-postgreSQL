/*
  Warnings:

  - You are about to drop the column `imageId` on the `PostImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostImage" DROP COLUMN "imageId",
ADD COLUMN     "imageURL" TEXT;
