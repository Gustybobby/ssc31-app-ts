-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'SELECTED', 'ACTIVE', 'REJECTED');

-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('JOIN', 'EVALUATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('STRING', 'NUM', 'BOOLEAN', 'POSITION', 'ROLE', 'ACT_HOURS', 'HOURS_SEMS');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('SHORTANS', 'PARAGRAPH', 'OPTIONS', 'MULTISELECT', 'PRIVACYPOLICY', 'INFO', 'ACT_HOURS', 'HOURS_SEMS');

-- CreateEnum
CREATE TYPE "IconType" AS ENUM ('CONTACT', 'GROUP', 'GEAR', 'BUILDING');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('INTERVIEW', 'MEETING', 'ACTIVITY');

-- CreateEnum
CREATE TYPE "MimeType" AS ENUM ('image_png', 'image_jpeg', 'application_pdf');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "poster" TEXT,
    "description" TEXT NOT NULL,
    "column_fetches" JSONB,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMember" (
    "id" TEXT NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "act_hrs" INTEGER NOT NULL DEFAULT 0,
    "act_records" JSONB,
    "transfer_records" JSONB,
    "position_id" TEXT,
    "role_id" TEXT,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "EventMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPosition" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "label" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT false,
    "can_regist" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "event_id" TEXT NOT NULL,

    CONSTRAINT "EventPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRole" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "label" TEXT NOT NULL,
    "can_appoint" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "event_id" TEXT NOT NULL,

    CONSTRAINT "EventRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventForm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "submitted_area" TEXT,
    "type" "FormType" NOT NULL DEFAULT 'OTHER',
    "response_type" "ResponseType" NOT NULL DEFAULT 'SINGLE',
    "open" BOOLEAN NOT NULL DEFAULT false,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "email_restricts" TEXT[],
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "field_order" TEXT[],
    "form_fields" JSONB,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "EventForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFormResponse" (
    "id" TEXT NOT NULL,
    "response" JSONB,
    "snapshot" JSONB,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "form_id" TEXT NOT NULL,
    "member_id" TEXT,

    CONSTRAINT "EventFormResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFormTemplate" (
    "id" SERIAL NOT NULL,
    "label" TEXT[],
    "placeholder" TEXT[],
    "success" TEXT[],
    "error" TEXT[],
    "default_value" TEXT[],
    "min_length" INTEGER[],
    "max_length" INTEGER[],
    "options" TEXT[],
    "required" BOOLEAN[],
    "data_type" "DataType"[],
    "field_type" "FieldType"[],

    CONSTRAINT "EventFormTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAppointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "icon" "IconType" NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "attendance_required" BOOLEAN NOT NULL,
    "created_by_id" TEXT,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "EventAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "mime_type" "MimeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "EventFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "check_in" TIMESTAMP(3),
    "check_out" TIMESTAMP(3),
    "appointment_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "ArchivedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedMember" (
    "id" TEXT NOT NULL,
    "position" TEXT,
    "role" TEXT,
    "act_hrs" INTEGER NOT NULL,
    "act_records" JSONB,
    "transfer_records" JSONB,
    "archived_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ArchivedMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_form_position_restricts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_form_role_restricts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventFormToEventPosition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventFormToEventRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventAppointmentToEventMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventFile_url_key" ON "EventFile"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_form_position_restricts_AB_unique" ON "_form_position_restricts"("A", "B");

-- CreateIndex
CREATE INDEX "_form_position_restricts_B_index" ON "_form_position_restricts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_form_role_restricts_AB_unique" ON "_form_role_restricts"("A", "B");

-- CreateIndex
CREATE INDEX "_form_role_restricts_B_index" ON "_form_role_restricts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventFormToEventPosition_AB_unique" ON "_EventFormToEventPosition"("A", "B");

-- CreateIndex
CREATE INDEX "_EventFormToEventPosition_B_index" ON "_EventFormToEventPosition"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventFormToEventRole_AB_unique" ON "_EventFormToEventRole"("A", "B");

-- CreateIndex
CREATE INDEX "_EventFormToEventRole_B_index" ON "_EventFormToEventRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventAppointmentToEventMember_AB_unique" ON "_EventAppointmentToEventMember"("A", "B");

-- CreateIndex
CREATE INDEX "_EventAppointmentToEventMember_B_index" ON "_EventAppointmentToEventMember"("B");

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "EventPosition"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "EventRole"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventPosition" ADD CONSTRAINT "EventPosition_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventRole" ADD CONSTRAINT "EventRole_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventForm" ADD CONSTRAINT "EventForm_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventFormResponse" ADD CONSTRAINT "EventFormResponse_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "EventForm"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventFormResponse" ADD CONSTRAINT "EventFormResponse_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "EventMember"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventAppointment" ADD CONSTRAINT "EventAppointment_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "EventPosition"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventAppointment" ADD CONSTRAINT "EventAppointment_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventFile" ADD CONSTRAINT "EventFile_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "EventFile" ADD CONSTRAINT "EventFile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "EventAppointment"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "EventMember"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ArchivedMember" ADD CONSTRAINT "ArchivedMember_archived_id_fkey" FOREIGN KEY ("archived_id") REFERENCES "ArchivedEvent"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ArchivedMember" ADD CONSTRAINT "ArchivedMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "_form_position_restricts" ADD CONSTRAINT "_form_position_restricts_A_fkey" FOREIGN KEY ("A") REFERENCES "EventForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_form_position_restricts" ADD CONSTRAINT "_form_position_restricts_B_fkey" FOREIGN KEY ("B") REFERENCES "EventPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_form_role_restricts" ADD CONSTRAINT "_form_role_restricts_A_fkey" FOREIGN KEY ("A") REFERENCES "EventForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_form_role_restricts" ADD CONSTRAINT "_form_role_restricts_B_fkey" FOREIGN KEY ("B") REFERENCES "EventRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventFormToEventPosition" ADD CONSTRAINT "_EventFormToEventPosition_A_fkey" FOREIGN KEY ("A") REFERENCES "EventForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventFormToEventPosition" ADD CONSTRAINT "_EventFormToEventPosition_B_fkey" FOREIGN KEY ("B") REFERENCES "EventPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventFormToEventRole" ADD CONSTRAINT "_EventFormToEventRole_A_fkey" FOREIGN KEY ("A") REFERENCES "EventForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventFormToEventRole" ADD CONSTRAINT "_EventFormToEventRole_B_fkey" FOREIGN KEY ("B") REFERENCES "EventRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventAppointmentToEventMember" ADD CONSTRAINT "_EventAppointmentToEventMember_A_fkey" FOREIGN KEY ("A") REFERENCES "EventAppointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventAppointmentToEventMember" ADD CONSTRAINT "_EventAppointmentToEventMember_B_fkey" FOREIGN KEY ("B") REFERENCES "EventMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
