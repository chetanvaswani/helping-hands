/*
  Warnings:

  - Added the required column `type` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('home', 'work', 'other');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "type" "AddressType" NOT NULL;

-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "expiry" SET DEFAULT now() + interval '5 minutes';
