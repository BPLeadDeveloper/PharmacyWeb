/*
  Warnings:

  - Made the column `is_active` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `pharmacists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "is_active" SET NOT NULL;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "is_active" SET NOT NULL;

-- AlterTable
ALTER TABLE "pharmacists" ALTER COLUMN "is_active" SET NOT NULL;
