-- Client lifecycle: archive / restore / data minimisation / permitted deletion (feat/client-deletion).
-- Purely additive. Hard deletion of a client happens only through the application workflow
-- (src/lib/portal/client-lifecycle.ts) and only when the decision engine allows it; the e-sign
-- append-only triggers from 0002 are untouched and still refuse UPDATE/DELETE on evidence tables.
ALTER TABLE "clients" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "archived_by_id" uuid;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "archive_reason" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "archive_note" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "data_minimised_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_archived_by_id_users_id_fk" FOREIGN KEY ("archived_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clients_archived_idx" ON "clients" ("archived_at");
