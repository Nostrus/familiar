CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_name" text NOT NULL,
	"country" text NOT NULL,
	"city_description" text NOT NULL,
	"listing_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clerk_users" (
	"clerk_user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
