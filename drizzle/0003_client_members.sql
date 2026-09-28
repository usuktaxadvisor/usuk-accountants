CREATE TABLE "client_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'MEMBER' NOT NULL,
	"can_sign" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"added_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "client_members" ADD CONSTRAINT "client_members_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_members" ADD CONSTRAINT "client_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_members" ADD CONSTRAINT "client_members_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "client_members_client_user_uq" ON "client_members" USING btree ("client_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "client_members_active_user_uq" ON "client_members" USING btree ("user_id") WHERE "client_members"."status" = 'ACTIVE';--> statement-breakpoint
-- Backfill: every existing client keeps its current portal user as the PRIMARY member. Idempotent (ON CONFLICT DO NOTHING),
-- so re-running the statement is harmless. clients.user_id is retained (primary contact); no rows are changed or removed.
INSERT INTO "client_members" ("client_id", "user_id", "role", "can_sign", "status")
SELECT c."id", c."user_id", 'PRIMARY', 1, 'ACTIVE' FROM "clients" c
ON CONFLICT ("client_id", "user_id") DO NOTHING;
