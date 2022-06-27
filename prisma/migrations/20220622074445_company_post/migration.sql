/*
  Warnings:

  - You are about to drop the `CompanyFeed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hashtags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyFeed" DROP CONSTRAINT "CompanyFeed_hashtagsId_fkey";

-- DropTable
DROP TABLE "CompanyFeed";

-- DropTable
DROP TABLE "Hashtags";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
