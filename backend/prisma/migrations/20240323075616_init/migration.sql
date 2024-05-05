/*
  Warnings:

  - You are about to drop the `Lecture_Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lecture_Room" DROP CONSTRAINT "Lecture_Room_room_id_fkey";

-- DropTable
DROP TABLE "Lecture_Room";
