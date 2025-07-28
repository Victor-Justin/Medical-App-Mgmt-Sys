ALTER TABLE "appointments" ALTER COLUMN "amount" SET DEFAULT '500.00';--> statement-breakpoint
ALTER TABLE "complaints" ALTER COLUMN "complaint_status" SET DEFAULT 'In Progress';--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "pay_status" SET DEFAULT 'unpaid';--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "user_id" serial NOT NULL;