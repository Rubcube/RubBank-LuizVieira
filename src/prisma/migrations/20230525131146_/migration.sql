/*
  Warnings:

  - You are about to drop the column `email` on the `Suport_auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Suport_auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Suport_info` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Suport_auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Suport_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suport_auth" DROP COLUMN "email",
ADD COLUMN     "cpf" VARCHAR(11) NOT NULL;

-- AlterTable
ALTER TABLE "Suport_info" ADD COLUMN     "email" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Suport_auth_cpf_key" ON "Suport_auth"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Suport_info_email_key" ON "Suport_info"("email");
