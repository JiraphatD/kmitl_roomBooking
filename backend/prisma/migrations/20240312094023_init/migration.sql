/*
  Warnings:

  - The values [unavailable] on the enum `RoomStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoomStatus_new" AS ENUM ('Active', 'Available', 'Unavailable');
ALTER TABLE "Room" ALTER COLUMN "room_status" TYPE "RoomStatus_new" USING ("room_status"::text::"RoomStatus_new");
ALTER TYPE "RoomStatus" RENAME TO "RoomStatus_old";
ALTER TYPE "RoomStatus_new" RENAME TO "RoomStatus";
DROP TYPE "RoomStatus_old";
COMMIT;
