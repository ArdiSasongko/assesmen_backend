/*
  Warnings:

  - Added the required column `created_at` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
