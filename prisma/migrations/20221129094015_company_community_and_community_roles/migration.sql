-- CreateEnum
CREATE TYPE "CommunityType" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "CommunityRole" AS ENUM ('ADMIN', 'MODERATOR');

-- CreateTable
CREATE TABLE "CompanyCommunity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CommunityType" NOT NULL,
    "companyId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "CompanyCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyCommunityRole" (
    "id" TEXT NOT NULL,
    "role" "CommunityRole" NOT NULL,
    "communityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "CompanyCommunityRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCommunity_name_key" ON "CompanyCommunity"("name");

-- AddForeignKey
ALTER TABLE "CompanyCommunity" ADD CONSTRAINT "CompanyCommunity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCommunity" ADD CONSTRAINT "CompanyCommunity_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCommunityRole" ADD CONSTRAINT "CompanyCommunityRole_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "CompanyCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCommunityRole" ADD CONSTRAINT "CompanyCommunityRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
