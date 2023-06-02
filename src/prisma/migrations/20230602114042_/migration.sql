-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'INREVIEW';

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "is_solved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "severity" INTEGER NOT NULL DEFAULT 0;
