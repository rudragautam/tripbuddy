CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'contacted', 'converted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."tour_type" AS ENUM('hills', 'mountain', 'desert', 'beach', 'backwaters', 'heritage', 'wildlife', 'snow');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor');--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"state" text NOT NULL,
	"tagline" text NOT NULL,
	"summary" text NOT NULL,
	"tour_type" "tour_type" NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"best_time_months" text NOT NULL,
	"best_time_note" text NOT NULL,
	"best_months" integer[] NOT NULL,
	"how_to_reach" text NOT NULL,
	"budget_per_day" jsonb NOT NULL,
	"facts" jsonb NOT NULL,
	"experiences" jsonb NOT NULL,
	"days" jsonb NOT NULL,
	"min_days" integer DEFAULT 2 NOT NULL,
	"scene_image" text,
	"last_checked" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"updated_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "destinations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"destination_slug" text,
	"days" integer,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"travel_date" text,
	"people" integer,
	"budget" text,
	"notes" text,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"assigned_to" integer,
	"ip_hash" text,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'editor' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"session_version" integer DEFAULT 1 NOT NULL,
	"failed_logins" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "destinations_tour_type_idx" ON "destinations" USING btree ("tour_type");--> statement-breakpoint
CREATE INDEX "destinations_published_idx" ON "destinations" USING btree ("published");--> statement-breakpoint
CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "enquiries_created_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "enquiries_ip_idx" ON "enquiries" USING btree ("ip_hash","created_at");