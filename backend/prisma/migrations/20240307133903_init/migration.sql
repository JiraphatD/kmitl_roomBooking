/*
  Warnings:

  - Added the required column `setup_date` to the `Accessories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accessories" ADD COLUMN     "setup_date" TIMESTAMPTZ NOT NULL;
