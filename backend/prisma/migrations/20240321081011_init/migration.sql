/*
  Warnings:

  - You are about to drop the column `cancel_code` on the `Booker` table. All the data in the column will be lost.
  - Added the required column `secret_key` to the `Booker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booker" DROP COLUMN "cancel_code",
ADD COLUMN     "secret_key" TEXT NOT NULL;
