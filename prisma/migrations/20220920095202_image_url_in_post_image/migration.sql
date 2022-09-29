/*
  Warnings:

  - You are about to drop the column `imageId` on the `PostImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageURL]` on the table `PostImage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PostImage_imageId_key";

-- AlterTable
ALTER TABLE "PostImage" DROP COLUMN "imageId",
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "PostImage_imageURL_key" ON "PostImage"("imageURL");
