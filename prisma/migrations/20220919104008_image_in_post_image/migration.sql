/*
  Warnings:

  - You are about to drop the column `imageURL` on the `PostImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `PostImage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PostImage" DROP COLUMN "imageURL",
ADD COLUMN     "imageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PostImage_imageId_key" ON "PostImage"("imageId");
