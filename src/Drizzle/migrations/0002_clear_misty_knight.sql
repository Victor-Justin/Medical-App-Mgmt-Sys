ALTER TABLE "appointments" ALTER COLUMN "ap_status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "start_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "end_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "time_slot";