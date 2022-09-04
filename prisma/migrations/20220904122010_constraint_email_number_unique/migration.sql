/*
  Warnings:

  - A unique constraint covering the columns `[contactNumber,contactEmail]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Branch_contactNumber_contactEmail_key" ON "Branch"("contactNumber", "contactEmail");
