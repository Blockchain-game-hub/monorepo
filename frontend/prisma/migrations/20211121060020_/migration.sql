-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "duration" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nonce" SET DEFAULT floor(random()*1000000000);
