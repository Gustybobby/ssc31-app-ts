/*
  Warnings:

  - A unique constraint covering the columns `[user_id,archived_id]` on the table `ArchivedMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[member_id,appointment_id]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,event_id]` on the table `EventMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArchivedMember_user_id_archived_id_key" ON "ArchivedMember"("user_id", "archived_id");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_member_id_appointment_id_key" ON "Attendance"("member_id", "appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventMember_user_id_event_id_key" ON "EventMember"("user_id", "event_id");
