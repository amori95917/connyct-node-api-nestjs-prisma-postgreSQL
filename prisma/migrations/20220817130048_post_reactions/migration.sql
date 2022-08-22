/*
  Warnings:

  - Added the required column `reactions` to the `PostLike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostLike" ADD COLUMN     "reactions" TEXT NOT NULL;
