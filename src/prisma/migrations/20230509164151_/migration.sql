/*
  Warnings:

  - The `account_number` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "account_number",
ADD COLUMN     "account_number" SERIAL NOT NULL,
ALTER COLUMN "transaction_password" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "complement" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User_auth" ALTER COLUMN "password" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_number_key" ON "Account"("account_number");
