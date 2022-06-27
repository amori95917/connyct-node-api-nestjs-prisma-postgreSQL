-- CreateTable
CREATE TABLE "Hashtags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyFeed" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "feedImages" TEXT[],
    "hashtagsId" TEXT NOT NULL,
    "isSaleAble" BOOLEAN NOT NULL,

    CONSTRAINT "CompanyFeed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hashtags_name_key" ON "Hashtags"("name");

-- AddForeignKey
ALTER TABLE "CompanyFeed" ADD CONSTRAINT "CompanyFeed_hashtagsId_fkey" FOREIGN KEY ("hashtagsId") REFERENCES "Hashtags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
