ALTER TABLE "clerk_users" ADD COLUMN IF NOT EXISTS "first_name" text;
--> statement-breakpoint
ALTER TABLE "clerk_users" ADD COLUMN IF NOT EXISTS "last_name" text;
--> statement-breakpoint
ALTER TABLE "clerk_users" ADD COLUMN IF NOT EXISTS "email" text;
