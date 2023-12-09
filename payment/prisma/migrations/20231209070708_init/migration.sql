/*
  Warnings:

  - The `payment_status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" TEXT NOT NULL DEFAULT 'incomplete';

-- DropEnum
DROP TYPE "PaymentStatus";
