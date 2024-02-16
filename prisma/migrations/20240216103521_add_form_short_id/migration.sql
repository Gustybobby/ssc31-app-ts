-- AlterTable
ALTER TABLE "EventForm" ADD COLUMN     "form_short_id" TEXT;

-- CreateTable
CREATE TABLE "EventFormShortId" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,

    CONSTRAINT "EventFormShortId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventFormShortId_form_id_key" ON "EventFormShortId"("form_id");

-- AddForeignKey
ALTER TABLE "EventFormShortId" ADD CONSTRAINT "EventFormShortId_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "EventForm"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
