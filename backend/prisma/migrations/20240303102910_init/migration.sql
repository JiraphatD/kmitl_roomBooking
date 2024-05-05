-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('Active', 'Available', 'unavailable');

-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('Small_Lecture_Room', 'Medium_Lecture_Room', 'Large_Lecture_Room', 'Education_Service_Room', 'Entertainment_Room', 'Large_Conference_Room', 'Small_Laboratory_Room', 'Large_Laboratory_Room', 'Support_Room', 'Multi_Purpose_Hall', 'None');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Student', 'Teacher', 'Admin', 'Unknown');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('Sent', 'NotSent');

-- CreateTable
CREATE TABLE "Booker" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role",

    CONSTRAINT "Booker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "SuperUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "booker_id" INTEGER NOT NULL,
    "advertiseId" INTEGER,
    "room_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "booked_datetime" TIMESTAMPTZ NOT NULL,
    "check_in_datetime" TIMESTAMPTZ NOT NULL,
    "check_out_datetime" TIMESTAMPTZ NOT NULL,
    "notified_user" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeclineDeleteBooking" (
    "id" INTEGER NOT NULL,
    "booker_name" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "check_in_datetime" TIMESTAMPTZ NOT NULL,
    "datetime" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "DeclineDeleteBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approvement" (
    "booking_id" INTEGER NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "approve_datetime" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Approvement_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" VARCHAR(255) NOT NULL,
    "room_name" TEXT NOT NULL,
    "room_image" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "seat" INTEGER NOT NULL,
    "total_uses" INTEGER NOT NULL,
    "room_status" "RoomStatus" NOT NULL,
    "room_category" "RoomCategory" NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laboratory" (
    "room_id" TEXT NOT NULL,
    "computer_quantity" INTEGER NOT NULL,
    "computer_brand" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "main_memory" TEXT NOT NULL,
    "gpu" TEXT NOT NULL,
    "operation_system" TEXT NOT NULL,
    "protection_system" TEXT NOT NULL,

    CONSTRAINT "Laboratory_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" SERIAL NOT NULL,
    "software_name" TEXT NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture_Room" (
    "room_id" TEXT NOT NULL,
    "size" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Accessories" (
    "id" SERIAL NOT NULL,
    "accessory_name" TEXT NOT NULL,
    "room_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "Accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertise" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "active_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "notification" "NotificationStatus",

    CONSTRAINT "Advertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvertiseRoom" (
    "id" SERIAL NOT NULL,
    "advertiseId" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "AdvertiseRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LaboratoryToSoftware" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Booker_email_key" ON "Booker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_username_key" ON "SuperUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Room_room_name_key" ON "Room"("room_name");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_Room_room_id_key" ON "Lecture_Room"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Accessories_id_key" ON "Accessories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertiseRoom_id_key" ON "AdvertiseRoom"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_LaboratoryToSoftware_AB_unique" ON "_LaboratoryToSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_LaboratoryToSoftware_B_index" ON "_LaboratoryToSoftware"("B");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_booker_id_fkey" FOREIGN KEY ("booker_id") REFERENCES "Booker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_advertiseId_fkey" FOREIGN KEY ("advertiseId") REFERENCES "Advertise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approvement" ADD CONSTRAINT "Approvement_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture_Room" ADD CONSTRAINT "Lecture_Room_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accessories" ADD CONSTRAINT "Accessories_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertiseRoom" ADD CONSTRAINT "AdvertiseRoom_advertiseId_fkey" FOREIGN KEY ("advertiseId") REFERENCES "Advertise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertiseRoom" ADD CONSTRAINT "AdvertiseRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaboratoryToSoftware" ADD CONSTRAINT "_LaboratoryToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "Laboratory"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaboratoryToSoftware" ADD CONSTRAINT "_LaboratoryToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;
