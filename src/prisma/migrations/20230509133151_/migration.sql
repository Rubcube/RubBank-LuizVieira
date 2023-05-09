-- AlterTable
ALTER TABLE "User_info" ADD COLUMN     "birth" DATE;

-- AddForeignKey
ALTER TABLE "User_auth" ADD CONSTRAINT "User_auth_user_info_id_fkey" FOREIGN KEY ("user_info_id") REFERENCES "User_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
