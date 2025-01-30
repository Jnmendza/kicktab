/*
  Warnings:

  - Added the required column `teamCode` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "teamCode" TEXT NOT NULL;
