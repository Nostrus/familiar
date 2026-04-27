ALTER TABLE "homes" ADD COLUMN "owner_clerk_user_id" text;
--> statement-breakpoint
ALTER TABLE "homes" ADD CONSTRAINT "homes_owner_clerk_user_id_clerk_users_clerk_user_id_fk" FOREIGN KEY ("owner_clerk_user_id") REFERENCES "public"."clerk_users"("clerk_user_id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "home_stay_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_id" integer NOT NULL,
	"requester_clerk_user_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "home_stay_requests" ADD CONSTRAINT "home_stay_requests_home_id_homes_id_fk" FOREIGN KEY ("home_id") REFERENCES "public"."homes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "home_stay_requests" ADD CONSTRAINT "home_stay_requests_requester_clerk_user_id_clerk_users_clerk_user_id_fk" FOREIGN KEY ("requester_clerk_user_id") REFERENCES "public"."clerk_users"("clerk_user_id") ON DELETE cascade ON UPDATE no action;
