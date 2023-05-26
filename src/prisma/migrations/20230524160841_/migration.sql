-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_suport_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_user_id_fkey";

-- AlterTable
ALTER TABLE "Messages" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "suport_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_suport_id_fkey" FOREIGN KEY ("suport_id") REFERENCES "Suport_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
