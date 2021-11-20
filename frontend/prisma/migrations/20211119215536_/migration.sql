/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" VARCHAR(64) NOT NULL,
ADD COLUMN     "nonce" INTEGER NOT NULL DEFAULT floor(random()*1000000000),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "username" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");
