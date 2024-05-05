/*
  Warnings:

  - Added the required column `quantity` to the `Accessories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accessories" ADD COLUMN     "quantity" INTEGER NOT NULL;
