CREATE TABLE IF NOT EXISTS "home_favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "home_favorites_home_user_unique" UNIQUE("home_id","user_id")
);

DO $$ BEGIN
	ALTER TABLE "home_favorites" ADD CONSTRAINT "home_favorites_home_id_homes_id_fk" FOREIGN KEY ("home_id") REFERENCES "public"."homes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "home_favorites" ADD CONSTRAINT "home_favorites_user_id_clerk_users_clerk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."clerk_users"("clerk_user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;