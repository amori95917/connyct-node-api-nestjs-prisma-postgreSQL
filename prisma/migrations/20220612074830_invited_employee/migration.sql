/*
  Warnings:

  - Made the column `companyId` on table `Branch` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_companyId_fkey";

-- AlterTable
ALTER TABLE "Branch" ALTER COLUMN "companyId" SET NOT NULL;

-- CreateTable
CREATE TABLE "InvitedEmployee" (
    "id" TEXT NOT NULL,
    "invitedId" TEXT NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "invitedRoleId" TEXT NOT NULL,
    "isInviteAccepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InvitedEmployee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitedEmployee" ADD CONSTRAINT "InvitedEmployee_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitedEmployee" ADD CONSTRAINT "InvitedEmployee_invitedRoleId_fkey" FOREIGN KEY ("invitedRoleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
