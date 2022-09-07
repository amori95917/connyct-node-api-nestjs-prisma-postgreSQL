-- CreateEnum
CREATE TYPE "CompanyStage" AS ENUM ('STARTUP', 'SCALEUP');

-- CreateEnum
CREATE TYPE "Ownership" AS ENUM ('SOLE', 'PARTNERSHIP', 'CORPORATE', 'LIMITEDLIABILITYCOMPANY', 'NONPROFIT');

-- CreateEnum
CREATE TYPE "RatingStatus" AS ENUM ('NEUTRAL', 'UPVOTED', 'DOWNVOTED');

-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('CORPORATE', 'BRANCH_OFFICE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "email_token" TEXT,
    "password_token" TEXT,
    "confirm" BOOLEAN NOT NULL DEFAULT true,
    "is_valid" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isSuperuser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Right" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "Right_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleRight" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "rightId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "RoleRight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "legalName" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "establishedDate" TIMESTAMP(3),
    "companyStage" "CompanyStage",
    "description" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "ownership" "Ownership",
    "addresses" JSONB,
    "numberOfemployees" INTEGER NOT NULL DEFAULT 1,
    "contactEmail" TEXT,
    "transactions" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "website" TEXT,
    "contactNumber" TEXT,
    "slogan" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" "BranchType" NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT,
    "state" TEXT,
    "street1" TEXT,
    "street2" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyEmployee" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagWithPost" (
    "id" TEXT NOT NULL,
    "tagsId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "TagWithPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    "isSaleAble" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reactions" (
    "id" TEXT NOT NULL,
    "reactionType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReaction" (
    "id" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostRating" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "rating" "RatingStatus" NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "postId" TEXT,
    "repliedToCommentId" TEXT,
    "repliedToReplyId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentMentions" (
    "id" TEXT NOT NULL,
    "mentionId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "CommentMentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentRating" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "rating" "RatingStatus" NOT NULL
);

-- CreateTable
CREATE TABLE "InvitedEmployee" (
    "id" TEXT NOT NULL,
    "invitedId" TEXT NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "invitedRoleId" TEXT NOT NULL,
    "isInviteAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "InvitedEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUnfollowCompany" (
    "id" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,
    "followedToId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "FollowUnfollowCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUserToUser" (
    "id" TEXT NOT NULL,
    "followedToId" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "FollowUserToUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "pirorityOrder" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_key" ON "User"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_key" ON "UserRole"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleRight_roleId_rightId_key" ON "RoleRight"("roleId", "rightId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_legalName_key" ON "Company"("legalName");

-- CreateIndex
CREATE UNIQUE INDEX "Company_registrationNumber_key" ON "Company"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Company_contactEmail_key" ON "Company"("contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_contactNumber_contactEmail_key" ON "Branch"("contactNumber", "contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyEmployee_employeeId_key" ON "CompanyEmployee"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_id_name_idx" ON "Tag"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Reactions_reactionType_key" ON "Reactions"("reactionType");

-- CreateIndex
CREATE INDEX "PostReaction_postId_reactionId_userId_idx" ON "PostReaction"("postId", "reactionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostRating_userId_postId_key" ON "PostRating"("userId", "postId");

-- CreateIndex
CREATE INDEX "Comment_postId_repliedToCommentId_repliedToReplyId_creatorI_idx" ON "Comment"("postId", "repliedToCommentId", "repliedToReplyId", "creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentRating_userId_commentId_key" ON "CommentRating"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitedEmployee_invitedEmail_key" ON "InvitedEmployee"("invitedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_type_key" ON "Industry"("type");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleRight" ADD CONSTRAINT "RoleRight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleRight" ADD CONSTRAINT "RoleRight_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleRight" ADD CONSTRAINT "RoleRight_rightId_fkey" FOREIGN KEY ("rightId") REFERENCES "Right"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyEmployee" ADD CONSTRAINT "CompanyEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyEmployee" ADD CONSTRAINT "CompanyEmployee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagWithPost" ADD CONSTRAINT "TagWithPost_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagWithPost" ADD CONSTRAINT "TagWithPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_repliedToCommentId_fkey" FOREIGN KEY ("repliedToCommentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_repliedToReplyId_fkey" FOREIGN KEY ("repliedToReplyId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentMentions" ADD CONSTRAINT "CommentMentions_mentionId_fkey" FOREIGN KEY ("mentionId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentMentions" ADD CONSTRAINT "CommentMentions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD CONSTRAINT "CommentRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD CONSTRAINT "CommentRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitedEmployee" ADD CONSTRAINT "InvitedEmployee_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitedEmployee" ADD CONSTRAINT "InvitedEmployee_invitedRoleId_fkey" FOREIGN KEY ("invitedRoleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUnfollowCompany" ADD CONSTRAINT "FollowUnfollowCompany_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUnfollowCompany" ADD CONSTRAINT "FollowUnfollowCompany_followedToId_fkey" FOREIGN KEY ("followedToId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUserToUser" ADD CONSTRAINT "FollowUserToUser_followedToId_fkey" FOREIGN KEY ("followedToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUserToUser" ADD CONSTRAINT "FollowUserToUser_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
