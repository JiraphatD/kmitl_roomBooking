-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_booker_id_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_booker_id_fkey" FOREIGN KEY ("booker_id") REFERENCES "Booker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
