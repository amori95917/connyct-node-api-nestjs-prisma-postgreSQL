-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstNme" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isSuperuser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP,
    "updatedAt" TIMESTAMP,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);