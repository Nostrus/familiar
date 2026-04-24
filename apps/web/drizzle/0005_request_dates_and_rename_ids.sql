DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'homes'
      AND column_name = 'owner_clerk_user_id'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'homes'
      AND column_name = 'owner_id'
  ) THEN
    ALTER TABLE "homes" RENAME COLUMN "owner_clerk_user_id" TO "owner_id";
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'home_stay_requests'
      AND column_name = 'requester_clerk_user_id'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'home_stay_requests'
      AND column_name = 'requester_id'
  ) THEN
    ALTER TABLE "home_stay_requests" RENAME COLUMN "requester_clerk_user_id" TO "requester_id";
  END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "home_stay_requests" ADD COLUMN IF NOT EXISTS "requested_start_date" date;
--> statement-breakpoint
ALTER TABLE "home_stay_requests" ADD COLUMN IF NOT EXISTS "requested_end_date" date;
--> statement-breakpoint
UPDATE "home_stay_requests"
SET
  "requested_start_date" = COALESCE("requested_start_date", CURRENT_DATE),
  "requested_end_date" = COALESCE("requested_end_date", CURRENT_DATE + 1);
--> statement-breakpoint
ALTER TABLE "home_stay_requests" ALTER COLUMN "requested_start_date" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "home_stay_requests" ALTER COLUMN "requested_end_date" SET NOT NULL;
