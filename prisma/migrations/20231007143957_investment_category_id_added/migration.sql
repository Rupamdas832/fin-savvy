/*
  Warnings:

  - Added the required column `investment_category_id` to the `Investments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Investments" ADD COLUMN     "investment_category_id" TEXT NOT NULL;
