/*
  Warnings:

  - You are about to drop the column `checkIn` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `attendances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendances` DROP COLUMN `checkIn`,
    DROP COLUMN `checkOut`,
    ADD COLUMN `type` ENUM('CHECK_IN', 'CHECK_OUT') NOT NULL DEFAULT 'CHECK_IN';
