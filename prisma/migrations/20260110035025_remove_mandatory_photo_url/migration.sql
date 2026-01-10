/*
  Warnings:

  - Made the column `photoUrl` on table `attendances` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `attendances` MODIFY `photoUrl` VARCHAR(191) NOT NULL;
