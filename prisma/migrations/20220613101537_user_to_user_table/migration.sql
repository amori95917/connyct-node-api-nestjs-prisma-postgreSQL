-- CreateTable
CREATE TABLE "FollowUserToUser" (
    "id" TEXT NOT NULL,
    "followedToId" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,
    "commonCompanyId" TEXT NOT NULL,

    CONSTRAINT "FollowUserToUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FollowUserToUser" ADD CONSTRAINT "FollowUserToUser_followedToId_fkey" FOREIGN KEY ("followedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUserToUser" ADD CONSTRAINT "FollowUserToUser_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUserToUser" ADD CONSTRAINT "FollowUserToUser_commonCompanyId_fkey" FOREIGN KEY ("commonCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
