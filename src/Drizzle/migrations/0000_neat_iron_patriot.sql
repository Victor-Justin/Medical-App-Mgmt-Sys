CREATE TYPE "public"."ap_status" AS ENUM('cancelled', 'pending', 'confirmed');--> statement-breakpoint
CREATE TYPE "public"."complaint_status" AS ENUM('In Progress', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."pay_status" AS ENUM('paid', 'unpaid');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'doctor', 'patient');--> statement-breakpoint
CREATE TABLE "appointments" (
	"ap_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"doc_id" serial NOT NULL,
	"ap_date" date NOT NULL,
	"time_slot" timestamp NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"ap_status" "ap_status" NOT NULL,
	"created_on" timestamp NOT NULL,
	"updated_on" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"comp_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"ap_id" serial NOT NULL,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"complaint_status" "complaint_status" NOT NULL,
	"created_on" timestamp NOT NULL,
	"updated_on" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"doc_id" serial PRIMARY KEY NOT NULL,
	"f_name" varchar(50) NOT NULL,
	"l_name" varchar(50) NOT NULL,
	"specialization" text NOT NULL,
	"contact_no" numeric NOT NULL,
	"available_day" text NOT NULL,
	"created_on" timestamp NOT NULL,
	"updated_on" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"pay_id" serial PRIMARY KEY NOT NULL,
	"trans_id" serial NOT NULL,
	"ap_id" serial NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"pay_status" "pay_status" NOT NULL,
	"pay_date" date NOT NULL,
	"created_on" timestamp NOT NULL,
	"updated_on" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"presc_id" serial PRIMARY KEY NOT NULL,
	"ap_id" serial NOT NULL,
	"doc_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"notes" text NOT NULL,
	"created_on" timestamp NOT NULL,
	"updated_on" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"f_name" varchar(50) NOT NULL,
	"l_name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"contact_no" numeric NOT NULL,
	"role" "role" DEFAULT 'patient' NOT NULL,
	"created_on" timestamp NOT NULL,
	"updated_on" timestamp NOT NULL,
	"is_verified" boolean DEFAULT false,
	"verification_code" varchar(10),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doc_id_doctors_doc_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."doctors"("doc_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_ap_id_appointments_ap_id_fk" FOREIGN KEY ("ap_id") REFERENCES "public"."appointments"("ap_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_ap_id_appointments_ap_id_fk" FOREIGN KEY ("ap_id") REFERENCES "public"."appointments"("ap_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_ap_id_appointments_ap_id_fk" FOREIGN KEY ("ap_id") REFERENCES "public"."appointments"("ap_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doc_id_doctors_doc_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."doctors"("doc_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;