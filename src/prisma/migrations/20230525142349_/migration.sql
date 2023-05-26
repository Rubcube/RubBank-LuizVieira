/*
  Warnings:

  - You are about to drop the column `is_solved` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `status` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('TODO', 'DOING', 'DONE');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "is_solved",
ADD COLUMN     "status" "TicketStatus" NOT NULL;
