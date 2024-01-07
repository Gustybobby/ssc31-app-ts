/*
  Warnings:

  - Added the required column `user_id` to the `EventFormResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventFormResponse" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EventFormResponse" ADD CONSTRAINT "EventFormResponse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
