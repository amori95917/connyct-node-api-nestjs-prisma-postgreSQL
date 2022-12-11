-- CreateTable
CREATE TABLE "CommunityPolicy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "CommunityPolicy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunityPolicy" ADD CONSTRAINT "CommunityPolicy_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "CompanyCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
