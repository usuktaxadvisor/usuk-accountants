-- Client overview redesign (feat/client-overview-cards). Purely additive: three new tables, no change to
-- any existing table, row or trigger. Safe to apply before the code that uses it is deployed.
CREATE TABLE IF NOT EXISTS "engagements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL REFERENCES "clients"("id"),
	"service" text NOT NULL,
	"title" text NOT NULL,
	"tax_year" text NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"recurring" integer DEFAULT 0 NOT NULL,
	"next_action" text,
	"rolled_from_id" uuid,
	"created_by_id" uuid REFERENCES "users"("id"),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "engagements_client_idx" ON "engagements" ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "engagements_client_service_year_uq" ON "engagements" ("client_id", "service", "tax_year");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "engagement_deadlines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"engagement_id" uuid NOT NULL REFERENCES "engagements"("id"),
	"client_id" uuid NOT NULL REFERENCES "clients"("id"),
	"label" text NOT NULL,
	"due_date" date NOT NULL,
	"kind" text DEFAULT 'FILING' NOT NULL,
	"source" text DEFAULT 'MANUAL' NOT NULL,
	"rule_key" text,
	"done_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "engagement_deadlines_client_idx" ON "engagement_deadlines" ("client_id", "due_date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "engagement_deadlines_rule_uq" ON "engagement_deadlines" ("engagement_id", "rule_key");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL REFERENCES "clients"("id"),
	"author_id" uuid NOT NULL REFERENCES "users"("id"),
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_notes_client_idx" ON "client_notes" ("client_id", "created_at");
