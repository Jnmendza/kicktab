/*
  Warnings:

  - Added the required column `endDate` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flagUrl` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "League" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "flagUrl" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "code" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "founded" INTEGER,
ADD COLUMN     "venueId" INTEGER;

-- CreateTable
CREATE TABLE "Venue" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "capacity" INTEGER,
    "surface" TEXT,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
