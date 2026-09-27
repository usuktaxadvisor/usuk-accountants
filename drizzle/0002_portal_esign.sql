CREATE TYPE "public"."idv_method" AS ENUM('IN_PERSON_PHOTO_ID', 'THIRD_PARTY_KBA', 'MULTI_YEAR_RELATIONSHIP', 'VIDEO_PHOTO_ID');--> statement-breakpoint
CREATE TYPE "public"."sig_action" AS ENUM('APPROVAL', 'SIGNATURE', 'APPROVAL_AND_SIGNATURE');--> statement-breakpoint
CREATE TYPE "public"."sig_doc_kind" AS ENUM('GENERAL', 'TAX_RETURN', 'ENGAGEMENT_LETTER', 'ADVISORY', 'DECLARATION', 'IRS_8879', 'IRS_8878');--> statement-breakpoint
CREATE TYPE "public"."sig_field_type" AS ENUM('SIGNATURE', 'INITIALS', 'DATE', 'NAME', 'CHECKBOX', 'ACKNOWLEDGEMENT');--> statement-breakpoint
CREATE TYPE "public"."sig_request_status" AS ENUM('DRAFT', 'AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED', 'COMPLETED', 'DECLINED', 'VOIDED', 'EXPIRED', 'SUPERSEDED');--> statement-breakpoint
CREATE TYPE "public"."sig_signer_status" AS ENUM('PENDING', 'VIEWED', 'CONSENTED', 'APPROVED', 'SIGNED', 'DECLINED');--> statement-breakpoint
CREATE TABLE "esign_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"version" text NOT NULL,
	"text_sha256" text NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip" text,
	"user_agent" text,
	"request_id" uuid
);
--> statement-breakpoint
CREATE TABLE "identity_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"method" "idv_method" NOT NULL,
	"verified_by_id" uuid NOT NULL,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"provider_ref" text,
	"note" text,
	"valid_until" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "signature_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seq" bigserial NOT NULL,
	"request_id" uuid NOT NULL,
	"signer_id" uuid,
	"actor_user_id" uuid,
	"type" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip" text,
	"user_agent" text,
	"meta" jsonb,
	"prev_hash" text,
	"hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signature_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"certificate_json" jsonb NOT NULL,
	"certificate_sha256" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signature_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"request_document_id" uuid NOT NULL,
	"signer_id" uuid NOT NULL,
	"type" "sig_field_type" NOT NULL,
	"page" integer NOT NULL,
	"x_pct" integer DEFAULT 0 NOT NULL,
	"y_pct" integer DEFAULT 0 NOT NULL,
	"w_pct" integer DEFAULT 2500 NOT NULL,
	"h_pct" integer DEFAULT 600 NOT NULL,
	"required" integer DEFAULT 1 NOT NULL,
	"label" text,
	"value_text" text,
	"filled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "signature_request_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"delivery_id" uuid NOT NULL,
	"delivery_version" integer NOT NULL,
	"position" integer DEFAULT 1 NOT NULL,
	"frozen_sha256" text NOT NULL,
	"frozen_size_bytes" integer NOT NULL,
	"frozen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"requires_signature" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signature_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"title" text NOT NULL,
	"action" "sig_action" NOT NULL,
	"doc_kind" "sig_doc_kind" DEFAULT 'GENERAL' NOT NULL,
	"signing_order" text DEFAULT 'PARALLEL' NOT NULL,
	"status" "sig_request_status" DEFAULT 'DRAFT' NOT NULL,
	"message" text,
	"due_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"consent_version" text NOT NULL,
	"created_by_id" uuid NOT NULL,
	"sent_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"closed_reason" text,
	"superseded_by_id" uuid,
	"sealed_drive_file_id" text,
	"sealed_sha256" text,
	"evidence_drive_file_id" text,
	"evidence_sha256" text,
	"last_reminder_at" timestamp with time zone,
	"retention_class" text DEFAULT 'STANDARD_7Y' NOT NULL,
	"retain_until" timestamp with time zone,
	"legal_hold_at" timestamp with time zone,
	"legal_hold_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signature_signers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'SIGNER' NOT NULL,
	"sequence" integer DEFAULT 1 NOT NULL,
	"status" "sig_signer_status" DEFAULT 'PENDING' NOT NULL,
	"viewed_at" timestamp with time zone,
	"consented_at" timestamp with time zone,
	"consent_version" text,
	"otp_verified_at" timestamp with time zone,
	"otp_hash" text,
	"otp_expires_at" timestamp with time zone,
	"otp_attempts" integer DEFAULT 0 NOT NULL,
	"approved_at" timestamp with time zone,
	"signed_at" timestamp with time zone,
	"declined_at" timestamp with time zone,
	"decline_reason" text,
	"signature_method" text,
	"signature_text" text,
	"signature_image_png" text,
	"ip" text,
	"user_agent" text,
	"auth_method" text,
	"identity_verification_id" uuid
);
--> statement-breakpoint
ALTER TABLE "esign_consents" ADD CONSTRAINT "esign_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verifications" ADD CONSTRAINT "identity_verifications_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verifications" ADD CONSTRAINT "identity_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verifications" ADD CONSTRAINT "identity_verifications_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_events" ADD CONSTRAINT "signature_events_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_events" ADD CONSTRAINT "signature_events_signer_id_signature_signers_id_fk" FOREIGN KEY ("signer_id") REFERENCES "public"."signature_signers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_events" ADD CONSTRAINT "signature_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_evidence" ADD CONSTRAINT "signature_evidence_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_fields" ADD CONSTRAINT "signature_fields_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_fields" ADD CONSTRAINT "signature_fields_request_document_id_signature_request_documents_id_fk" FOREIGN KEY ("request_document_id") REFERENCES "public"."signature_request_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_fields" ADD CONSTRAINT "signature_fields_signer_id_signature_signers_id_fk" FOREIGN KEY ("signer_id") REFERENCES "public"."signature_signers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_request_documents" ADD CONSTRAINT "signature_request_documents_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_request_documents" ADD CONSTRAINT "signature_request_documents_delivery_id_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."deliveries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_requests" ADD CONSTRAINT "signature_requests_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_requests" ADD CONSTRAINT "signature_requests_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_signers" ADD CONSTRAINT "signature_signers_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_signers" ADD CONSTRAINT "signature_signers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signature_signers" ADD CONSTRAINT "signature_signers_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sig_evidence_req_uq" ON "signature_evidence" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sig_req_doc_uq" ON "signature_request_documents" USING btree ("request_id","delivery_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sig_signer_req_user_uq" ON "signature_signers" USING btree ("request_id","user_id");--> statement-breakpoint
-- Append-only guard: no UPDATE or DELETE on the evidence tables, whatever the application does.
-- Administrative escape hatch (documented in docs/client-portal-esign.md): a database owner performing a
-- legally required deletion, retention purge or disaster recovery runs, inside one transaction,
--   ALTER TABLE signature_events DISABLE TRIGGER signature_events_append_only;  ... ;  ALTER TABLE ... ENABLE TRIGGER ...;
-- The application role never does this; the action is deliberate, privileged and visible in the database history.
CREATE OR REPLACE FUNCTION esign_append_only() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION 'signature evidence is append-only (%.%) — see docs/client-portal-esign.md for the administrative recovery procedure', TG_TABLE_SCHEMA, TG_TABLE_NAME; END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER signature_events_append_only BEFORE UPDATE OR DELETE ON "signature_events" FOR EACH ROW EXECUTE FUNCTION esign_append_only();--> statement-breakpoint
CREATE TRIGGER signature_evidence_append_only BEFORE UPDATE OR DELETE ON "signature_evidence" FOR EACH ROW EXECUTE FUNCTION esign_append_only();--> statement-breakpoint
CREATE TRIGGER esign_consents_append_only BEFORE UPDATE OR DELETE ON "esign_consents" FOR EACH ROW EXECUTE FUNCTION esign_append_only();--> statement-breakpoint
CREATE INDEX "sig_requests_client_status_idx" ON "signature_requests" ("client_id", "status");--> statement-breakpoint
CREATE INDEX "sig_events_request_idx" ON "signature_events" ("request_id", "seq");
