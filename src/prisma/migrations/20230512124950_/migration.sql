/*
  Warnings:

  - You are about to drop the column `email` on the `User_auth` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `User_info` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `User_auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User_info` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `User_auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_auth_email_key";

-- DropIndex
DROP INDEX "User_info_cpf_key";

-- AlterTable
ALTER TABLE "User_auth" DROP COLUMN "email",
ADD COLUMN     "cpf" VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE "User_info" DROP COLUMN "cpf",
ADD COLUMN     "email" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_cpf_key" ON "User_auth"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_info_email_key" ON "User_info"("email");
