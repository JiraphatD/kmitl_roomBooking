/*
  Warnings:

  - Added the required column `cancel_code` to the `Booker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booker" ADD COLUMN     "cancel_code" TEXT NOT NULL;
