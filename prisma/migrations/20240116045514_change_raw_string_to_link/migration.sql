/*
  Warnings:

  - The values [RAW_STRING] on the enum `DataType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DataType_new" AS ENUM ('STRING', 'LINK', 'NUM', 'NUM_STRING', 'BOOLEAN', 'POSITION', 'ROLE', 'ACT_HOURS', 'HOURS_SEMS');
ALTER TABLE "EventFormTemplate" ALTER COLUMN "data_type" TYPE "DataType_new"[] USING ("data_type"::text::"DataType_new"[]);
ALTER TYPE "DataType" RENAME TO "DataType_old";
ALTER TYPE "DataType_new" RENAME TO "DataType";
DROP TYPE "DataType_old";
COMMIT;
