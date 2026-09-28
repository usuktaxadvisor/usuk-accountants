# Client portal — e-signature & approval module

Branch `feat/portal-esign`. Extends the existing staff → client **deliveries** workflow with an evidence-backed, in-portal review / approve / sign flow. Nothing in the existing portal is redesigned; the module hangs off `deliveries` and the existing auth, Drive storage, email and audit modules.

## 1. Architecture decision

**Native implementation (Option A), with document-type controls and a pluggable identity-verification step for IRS e-file authorisations.**

Why native rather than an embedded provider (DocuSign / Dropbox Sign / Adobe Sign / SignWell):

| Criterion | Native (chosen) | Embedded provider |
|---|---|---|
| UK validity (ECA 2000 s.7, UK eIDAS, Law Commission 2019) | Simple e-signature with intent, attribution and integrity evidence — sufficient for engagement letters, approvals, declarations | Same tier (simple / advanced) unless a qualified certificate is bought |
| US validity (ESIGN 15 U.S.C. §7001; UETA) | Consent + intent + attribution + record retention — all captured | Same |
| IRS Forms 8878/8879 remote e-sign (Pub. 1345) | Needs NIST SP 800-63 Level 2 **and** third-party KBA for every remote signing. Not provided by portal login → **document-type control**: remote e-signature is switched off (`ESIGN_IRS_REMOTE_ENABLED` unset); handwritten print-sign-upload route is used | Only providers with an IRS-KBA add-on satisfy this; still requires a paid ID-check per signer |
| Evidence | SHA-256 of frozen original and sealed PDF; append-only, hash-chained event log (DB triggers forbid UPDATE/DELETE); versioned consent text hash; email OTP re-auth; IP/UA; JSON certificate + PDF rendering | Provider certificate of completion (comparable), but held by a third party |
| Data residency / sub-processors | Tax documents never leave Neon + the firm's Drive | Full return PDFs sent to a US SaaS; AI/data-use terms to review |
| Client experience | Never leaves usukaccountants.com; no extra account | Embedded signing iframe, provider branding limits on cheaper tiers |
| Cost | £0 per envelope; no monthly minimum | Typically $10–$40/user/month plus per-envelope fees; KBA $2–$5 per check |
| Webhooks / replay risk | None to secure | Signature verification, idempotency, replay protection required |
| Cryptographic PAdES seal | Not applied (hash-based integrity instead) | Applied by provider |

The one thing a provider gives that we cannot build ourselves is third-party KBA. That is isolated behind `identity_verifications` so a KBA vendor (or DocuSign ID Verification) can be added later without touching the signing flow.

## 2. Legal / regulatory research (re-verified 28 Sep 2026 from primary sources)

- **UK** — Electronic Communications Act 2000 s.7: an electronic signature "incorporated into or logically associated with" electronic data "shall ... be admissible in evidence". UK eIDAS (retained Reg. 910/2014, amended by SI 2019/89; Data (Use and Access) Act 2025 amendments do not touch Art. 25) Art. 25(1): an electronic signature "shall not be denied legal effect and admissibility ... solely on the grounds that it is in an electronic form". Law Commission *Electronic execution of documents* (Law Com 386, Sept 2019; Government response 2020; Industry Working Group final report Feb 2023): an electronic signature "is capable in law of being used to execute a document ... provided that (i) the person signing intends to authenticate the document and (ii) any formalities relating to execution are satisfied" — typed names, pasted images and click-to-accept all qualify. **Limits**: deeds (witness must be physically present), wills, lasting powers of attorney, statutory declarations and HM Land Registry dispositions (Practice Guide 82) need more than a simple e-signature — the consent text and document-type list exclude them. **HMRC**: accepts digital/electronic signatures on 64-8, P87, Marriage Allowance and R40 (Agent Update 115, Dec 2023) and requires an *advanced* electronic signature for repayment nominations; "all other claims and paper tax returns will still require an original signature". Our portal approvals are the client's authority to the agent to file online — a matter of general contract/evidence law, not an HMRC paper form.
- **UK GDPR / ICO** — signature evidence (IP, user agent, timestamps, login identity) is personal data processed under legitimate interests / legal obligation (evidencing consent and contract). It is minimised (no document contents in events, no ID numbers in IDV notes), retained with the engagement record, and disclosed to the client in the consent text.
- **US** — ESIGN Act 15 U.S.C. §7001 et seq. and UETA: a signature may not be denied effect because it is electronic; consumer consent to electronic records; records must be retained in a form accurately reproducible. Implemented by the versioned consent text, the sealed PDF and the JSON certificate.
- **IRS** — Publication 1345 (Rev. Dec 2025, replaces Nov 2024) and the *Frequently Asked Questions for IRS e-file Signature Authorization* (reviewed 27 Jun 2026); Form 8879 (Rev. Jan 2021) and Form 8878 (2025) instructions:
  - Forms 8878/8879 may be e-signed "if the software provides the electronic signature capability"; a portal signing is a **remote transaction** ("the ERO isn't physically present with the taxpayer").
  - Identity verification for remote e-signature "must be in accordance with National Institute of Standards and Technology, Special Publication 800-63 ... Level 2 assurance level **and knowledge-based authentication** or higher assurance level", and "must be completed every time a taxpayer electronically signs Form 8878 or 8879". The IRS does **not** use the term "IAL2". If KBA fails three times the ERO "must obtain a handwritten signature".
  - The only exceptions are **in-person**: photo-ID inspection when the taxpayer signs in the ERO's presence, and no further verification where the taxpayer signs in person and has a "multi-year business relationship". Neither applies to the portal. *Our earlier wording that in-person ID or a multi-year relationship could satisfy remote signing was wrong and has been corrected in `remoteEsignPermitted`.*
  - Record-keeping for a remote e-signature: "Digital image of the signed form", "Date and time of the signature", "Taxpayer's computer IP address (Remote transaction only)", "Taxpayer's login identification – username (Remote transaction only)", the identity-verification result, and the "Method used to sign the record ... or other audit trail". Signatures "must be linked to their respective electronic records" so they "can't be excised, copied or otherwise transferred". Retention: "three years from the return due date or the IRS received date, whichever is later", in "a tamper-proof record in a secure, access-controlled storage system".
  - "An electronic signature via remote transaction does **not** include handwritten signatures on Forms 8878 or 8879 sent to the ERO by hand delivery, U.S. mail, private delivery service, fax, email or an Internet website" — so print → sign → upload through the portal is a handwritten signature with no KBA requirement.
  - **Decision**: the portal has no KBA provider, therefore remote e-signature of IRS_8879 / IRS_8878 is refused (`ESIGN_IRS_REMOTE_ENABLED` unset). Even when a KBA provider is integrated and the flag is set, the gate requires a THIRD_PARTY_KBA pass with a provider reference recorded within 24 hours of the request for that signer. The portal already captures every retained item above for ordinary documents (sealed image, timestamps, IP, login identity, method, audit trail).
- **Professional / retention** — MLR 2017 reg. 40: CDD records "five years beginning on the date on which ... the business relationship has come to an end" (ceiling ten years unless another enactment or legal proceedings require longer). HMRC: 22 months (employees), 5 years after 31 January (self-employed), 6 years (companies), longer with an open enquiry. UK GDPR Art. 5(1)(e) / ICO: keep no longer than necessary and be able to justify the period. No statute prescribes a retention period for e-signature audit trails as such.

Sources (all fetched 28 Sep 2026): irs.gov/pub/irs-pdf/p1345.pdf; irs.gov/e-file-providers/frequently-asked-questions-for-irs-efile-signature-authorization; irs.gov/pub/irs-pdf/f8879.pdf; irs.gov/pub/irs-pdf/f8878.pdf; legislation.gov.uk/ukpga/2000/7/section/7; legislation.gov.uk/eur/2014/910/article/25; Law Com 386 (2019) and IWG final report (2023) on gov.uk; HM Land Registry PG82; gov.uk Agent Update 115; gov.uk "Receive Income Tax or PAYE repayments on behalf of others"; legislation.gov.uk/uksi/2017/692/regulation/40; ICO storage-limitation guidance; gov.uk record-keeping pages.

## 3. Database changes (`drizzle/0002_portal_esign.sql`)

New enums `sig_action`, `sig_request_status`, `sig_signer_status`, `sig_field_type`, `sig_doc_kind`, `idv_method`. New tables:

- `signature_requests` — the envelope: client, title, action (APPROVAL / SIGNATURE / APPROVAL_AND_SIGNATURE), doc kind, signing order, status, due/expiry, consent version, sealed/evidence Drive ids + hashes, retention class / `retain_until` / legal hold.
- `signature_request_documents` — which delivery version(s) are in the envelope, with `frozen_sha256` computed at creation.
- `signature_signers` — one row per signer (portal user) with their own view/consent/OTP/approve/sign timestamps, method, IP, UA, auth method, optional identity-verification link.
- `signature_fields` — placed fields (SIGNATURE / INITIALS / DATE / NAME / CHECKBOX / ACKNOWLEDGEMENT) in page-percentage coordinates; page `9999` = last page preset, `0` = signing record page.
- `signature_events` — **append-only**, hash-chained (`prev_hash`, `hash`), ordered by a `seq` bigserial (never by wall-clock ties); DB trigger rejects UPDATE/DELETE. Appends take a per-request advisory lock so concurrent writers cannot fork the chain.
- `signature_evidence` — the JSON certificate + its SHA-256 (append-only trigger).
- `esign_consents` — every consent acceptance with version and text hash (append-only trigger).
- `identity_verifications` — IRS Pub. 1345 verification record (method, verifier, provider ref, validity). No ID numbers.

Existing tables are untouched (the migration is purely additive: CREATE TYPE / CREATE TABLE / ADD CONSTRAINT / CREATE INDEX / one trigger function; no ALTER of existing tables, no DROP). `deliveries` remains the document store; the original Drive file is never modified. Verified 28 Sep 2026 by applying 0000 → 0001 → 0002 in order to a fresh PostgreSQL 16 and running `tests/esign-db.integration.test.ts` against it.

**Append-only triggers and the administrative escape hatch.** The triggers on `signature_events`, `signature_evidence` and `esign_consents` raise on every UPDATE/DELETE, from any role, including the application's. A role that is not the table owner cannot disable them (`must be owner of table`). When a legally required deletion (e.g. a substantiated erasure request after retention has ended), a retention purge, or disaster recovery genuinely needs to modify these rows, the database owner runs, in one transaction and with a written record of who/why:

```sql
BEGIN;
ALTER TABLE signature_events   DISABLE TRIGGER signature_events_append_only;
ALTER TABLE signature_evidence DISABLE TRIGGER signature_evidence_append_only;
ALTER TABLE esign_consents     DISABLE TRIGGER esign_consents_append_only;
-- ... the specific, minimal statements ...
ALTER TABLE signature_events   ENABLE TRIGGER signature_events_append_only;
ALTER TABLE signature_evidence ENABLE TRIGGER signature_evidence_append_only;
ALTER TABLE esign_consents     ENABLE TRIGGER esign_consents_append_only;
COMMIT;
```

Foreign keys are `ON DELETE NO ACTION`, so a request cannot be deleted while its events exist — deletion is deliberately a multi-step, privileged operation. Ordinary migrations (adding columns/tables) are unaffected by the triggers. Neon point-in-time restore remains available for disaster recovery.

### 3a. Client membership (`drizzle/0003_client_members.sql`)

Households (husband and wife, joint taxpayers) and companies (several directors, an authorised contact) need more than one portal login per client, and the original model allowed exactly one (`clients.user_id`, unique). Migration 0003 adds **`client_members`** — `client_id`, `user_id`, `role` (PRIMARY | JOINT | DIRECTOR | CONTACT | MEMBER), `can_sign`, `status` (ACTIVE | REMOVED), audit columns — with `UNIQUE (client_id, user_id)` and a partial unique index so a user is an ACTIVE member of **one** client (a session always resolves to exactly one client). The migration **backfills** a PRIMARY membership for every existing client from `clients.user_id` (idempotent `ON CONFLICT DO NOTHING`) and changes no existing rows, so no login breaks and no client is recreated.

Staged rollout, one source of truth: `client_members` decides *access and signing authorisation* everywhere (`src/lib/portal/members.ts`: `clientIdForUser`, `getMembership`, `listSigningMembers`). `clients.user_id` is retained as the *primary contact* (billing/general notifications, "Send password-reset link", cannot be removed as a member) and is always mirrored by a PRIMARY membership; a client without membership rows (should not exist after the backfill) still resolves through it. Staff manage people under **People on this client** (`/api/portal/clients/[id]/members`: add → own user + activation email; remove → status REMOVED, past signatures untouched; an email that already logs into another client is refused). Signature requests list every can-sign member as a possible signer, with **parallel** or **sequential** order; each signer has their own user, signer row, login, OTP, consent row, signature, timestamps, IP/user-agent and evidence entry, and a signer row is reachable only through its own user's session — nobody can act as anyone else. A view-only contact (`can_sign = 0`) sees joint requests as "being handled by another person" and has no signing route.

### 3b. Who may sign — signer identity rules (owner decisions, 28 Sep 2026)

Plain rules, enforced in code:

- **Every signer is a real individual portal member** with their own full name, their own email, their own login and their own session. A husband and wife are two members with two logins; one shared login can never sign twice (a user can be a signer on a request only once — `sig_signer_req_user_uq`).
- **Only members with "can sign" are offered as signers.** Staff tick *can sign* on the People panel; a company's bookkeeper or a family contact stays view-only unless staff explicitly grant it. View-only members (`can_sign = false`, or a removed membership) cannot sign, approve, acknowledge, or use the older *Approve — looks correct* document-review response — the server re-checks membership on every action (`canClientApprove` in `members.ts`), so a member switched to view-only later loses the right immediately. They can still view and download what they are allowed to see and watch the status.
- **A typed signature must be the signer's own registered name.** The signing screen says *You are signing as [registered name]*, pre-fills it, and accepts harmless presentation differences (capitalisation, spacing, punctuation/accents, an omitted or initialled middle name, a display prefix) but never a different first or last name (`typedNameMismatch` in `esign.ts`). If the name we hold is wrong the client is told to contact us so staff correct the record first — the client never substitutes another identity during signing.
- **A drawn signature is attributed, not OCR'd.** Attribution rests on: authenticated session of the registered member + OTP to their own email + accepted consent (version and text hash) + the explicit intent statement *"I am [registered name] and I intend this drawn signature to be my legally binding electronic signature"* + the drawn image and its SHA-256 + timestamps, IP and user agent — all in the hash-chained event log and the certificate.
- **Approval-only** needs the same identified member, review, consent and OTP; the evidence says *APPROVED* (approval record / approved copy), never *signed*.
- **Staff do not OTP themselves** and complete no identity forms for ordinary documents: upload → *Require client action* → choose approval/signature → tick signers → parallel or sequential → send. If a chosen signer has no name, no valid email, no active portal access, or is view-only, the request is refused with a plain-English message naming the fix.
- **History never changes.** Each signature request snapshots the signer's name and email at the moment it is created (`signature_signers.full_name/email`), and the completed certificate is hashed. If a client later changes their name or email, staff update the member record and *new* requests use the new details; completed records keep the name and email actually used when the document was signed (integration test: "historical evidence is immutable").

## 4. Signing lifecycle

Request: `AWAITING_CLIENT → VIEWED → PARTIALLY_SIGNED → COMPLETED`, or `→ DECLINED | VOIDED | EXPIRED | SUPERSEDED`.
Signer: `PENDING → VIEWED → CONSENTED → APPROVED → SIGNED` (steps depend on the action), or `→ DECLINED`.

1. Staff picks delivered PDF(s), the action, document type, signature placement preset, optional acknowledgement text, message and due date → `POST /api/portal/esign/requests`. Every document's bytes are read from Drive and hashed; the request is created with those hashes frozen; the client is emailed (no attachment).
2. Client opens *Documents requiring your action* → `/portal/sign/[id]`. The original is streamed through `/file`, **re-hashed on every serve** and refused on mismatch. First open records `document_viewed`.
3. Client ticks "I have reviewed" and accepts the consent (version + text hash stored) → `CONSENTED`.
4. A 6-digit code is emailed; verifying it sets `authMethod = PASSWORD_SESSION+EMAIL_OTP` (10-minute life, 5 attempts, hash only stored).
5. Approve (explicit confirmation) and/or sign (typed, drawn on a canvas, or click). Required acknowledgements must be ticked. Server records `signature_applied`, `signer_completed`.
6. When the server sees every signer complete: `completeRequest()` re-reads each original, refuses to seal if any hash drifted, draws the fields, appends the *Signing record* page, hashes the sealed PDF, uploads it and the evidence-certificate PDF to the client's Processed Documents folder, stores the JSON certificate, and records `all_signers_completed`. Client and staff are emailed.
7. Sealed PDF and evidence are served through `/signed` and `/evidence`, each re-hashed on every serve.

Supersession: replacing or withdrawing a delivery (existing routes) now calls `supersedeRequestsForDelivery`, closing any open request on the old version. Completed requests are never voided or altered; a corrected document is a new delivery version and a new request.

## 5. Evidence model

Per completed request: original PDF (unchanged, Drive), sealed signed PDF (Drive, hash in DB), evidence certificate PDF (Drive), JSON certificate (DB, hash in DB), append-only event chain (DB), consent record (DB), identity verification (DB, where used). The JSON certificate is authoritative; the PDFs are renderings. Verification later: fetch the JSON, recompute SHA-256 and compare with `signature_evidence.certificate_sha256`; recompute the event chain with `verifyChain`; hash the sealed PDF and compare.

## 6. Security model / threat model

- **Broken access control** — every client read goes through `getRequestForClient(clientId, id)` + `getSignerForUser(requestId, uid)`; mismatches return 404 (never "not yours"). Staff routes require `STAFF+`.
- **Guessed IDs** — UUIDv4 ids plus the ownership check above.
- **Wrong version** — bytes hashed at creation; re-hashed on every serve and at sealing; mismatch → refused + `access_denied` event.
- **File replacement after signature** — sealed hash recorded; `/signed` re-hashes; replace/withdraw supersedes open requests; completed requests cannot be voided.
- **Forged completion** — the browser never sets status; completion is derived server-side from signer rows.
- **Replay / double-sign** — OTP hash is cleared on success and compared in constant time; attempts are incremented atomically. Every signer transition is a compare-and-set on the status the caller saw (`StaleSignerStateError` → 409), and sealing is claimed atomically via `completed_at` (`SealInProgressError` → 409), so two tabs or two concurrent signers can never produce two signatures, two sealed PDFs or two certificates (proved against real PostgreSQL in `tests/esign-db.integration.test.ts`). Rate limits on every route (per-instance, documented limitation).
- **CSRF** — all mutations are JSON `fetch` POSTs; the Auth.js session cookie is `SameSite=Lax`, so a cross-site page cannot send it with a POST, and a cross-origin JSON POST is blocked by CORS preflight; no HTML forms and no GET side effects beyond the recorded first view.
- **XSS** — React escaping; PDFs served with `sandbox` CSP and `nosniff`; emails escape user text.
- **Malicious PDFs** — only `application/pdf` deliveries can be sent for signature; pdf-lib parses server-side; viewer is sandboxed.
- **Admin impersonation** — staff never sign for clients; a signer row must belong to a CLIENT user of that client.
- **Multiple tabs / stale sessions** — every action re-loads state and checks the step; a lost race returns 409 with `code: STALE` and the UI reloads the current state.
- **Cron** — `/api/portal/esign/cron` requires `Authorization: Bearer CRON_SECRET` (constant-time compare; missing/invalid → 401); expiry is a status-conditioned update recorded once; reminders are gated by `last_reminder_at` so repeated runs never duplicate them.
- **Tamper-evident log** — hash chain + DB triggers.

## 7. Notifications

Request email, reminders (cron: every 3 days while open, plus a due-date reminder — never more), OTP email, completion email; staff alerts on decline / partial / completion. No document is ever attached.

## 8. Retention

Evidence rows are append-only and never deleted by the application; there is no purge job. `src/lib/portal/esign-retention.ts` assigns each completed request a **retention class from its document type** and computes `retain_until`; `legal_hold_at` / `legal_hold_reason` suspend any purge indefinitely (set by the database owner or a future staff action). Classes: `STANDARD_7Y` (tax returns, general, declarations), `IRS_EFILE_AUTH_7Y` (statutory floor is 3 years from the return due/received date), `ENGAGEMENT_10Y` (MLR 2017 reg. 40 five years after the relationship ends — end date unknown at signing, so the ten-year ceiling), `ADVISORY_7Y`. Seven years is the firm's operational default and a policy choice, not a universal statutory requirement; it exceeds every applicable minimum found (IRS 3y; HMRC 22m/5y/6y; MLR 5y) and is documented for UK GDPR Art. 5(1)(e). Records under legal hold, open complaints, investigations or ongoing matters are never eligible: `mayPurge()` refuses while a hold is set, before `retain_until`, or when no date was computed. Drive files are under the firm's own Google Workspace retention.

## 9. Staff workflow

Clients → client → *Work for client review* → upload the PDF (existing) → **Require client action** → choose action, document type, documents, signature placement preset, optional acknowledgement, message, due date → *Send to client*. For Form 8878/8879 first **Record identity verification** (method, no ID numbers). Dashboard: *Signatures & approvals* (filter by status, search). Record page: frozen hashes, signers, event log with chain check, *View signature record (JSON)*, *Download evidence certificate*, *Download signed PDF*, *Void*.

## 10. Client workflow

Email → portal (own login) → *Documents requiring your action* → **Review & sign** → read/download → tick reviewed → accept consent → enter emailed code → approve → *You are signing as [name]* → type (own name) or draw signature → confirm intent → *Sign now* → done → *Download signed copy* / *Download signature record*. Nothing the portal already knows is asked again. Works on mobile (pointer events, responsive layout). Decline with a reason is available at every step.

## 11. Testing

`npm test` — 61 unit tests plus `tests/esign-db.integration.test.ts` (19 scenarios incl. membership backfill/legacy path, two- and three-member clients, parallel and sequential two-signer signing, decline by one signer, against a real PostgreSQL with migrations 0000–0002 applied and an in-memory Drive: lifecycle + seal + chain, approval-only, append-only enforcement from a non-owner role, hash mismatch refusal, two-tab race, concurrent seal, decline/void, supersede, expiry idempotence, cross-client isolation, years-later reconstruction; run with `ESIGN_TEST_DATABASE_URL=...`). Unit coverage: workflow rules, hash chain (tamper/reorder/delete detection), IRS gate, OTP, signature input validation, evidence certificate, PDF sealing on a synthetic document, and a pure-rule simulation of scenarios 1–8 and 11 from the brief. Scenarios 9, 10, 12, 13, 16 and 17 are integration behaviours (expired link → 409; foreign client → 404; no webhooks/provider exist; downloads; mobile) to be exercised on the preview deployment with a synthetic client before real use. `ESIGN_DEMO_OUT=<dir> npx vitest run tests/esign-demo.render.test.ts` renders the demo artefacts.

## 12. Deployment / configuration

1. Merge `feat/portal-esign`; Vercel builds as usual (`pdf-lib` added as a dependency).
2. Apply `drizzle/0002_portal_esign.sql` and then `drizzle/0003_client_members.sql` to Neon, in that order (same procedure as 0001; the 0003 backfill INSERT is one statement).
3. Add env var `CRON_SECRET` (random string) in Vercel (Production and Preview); `vercel.json` schedules `/api/portal/esign/cron` daily at 08:00 UTC. Leave `ESIGN_IRS_REMOTE_ENABLED` unset.
4. No other credentials. No provider account.
5. Test on Preview with a synthetic client (TEST CLIENT — Jane Smith) before any real request.

## 13. Costs

One-time: none. Recurring: none beyond existing Neon, Vercel, Resend and Google Workspace. Per signature: £0. Optional later: KBA provider for remote Form 8879 signing (typically $2–5 per check).

## 14. Disaster recovery / retrieving evidence years later

Everything needed is in two places the firm already controls: the Neon database (requests, signers, events, JSON certificate, consents, IDV) and the client's *Processed Documents* Drive folder (original, `*_SIGNED_*.pdf`, `*_EVIDENCE_*.pdf`). To prove a signature: open the staff record page or query `signature_requests` by client/title; download the JSON certificate; recompute the hashes with `sha256sum` on the Drive files and compare; the event chain is self-verifying. Neon point-in-time restore and Drive version history are the backups.

## 15. Known limits / phase 2

- Field placement uses presets (bottom-left / bottom-right of last page / signing page); drag-and-drop placement on a rendered page is phase 2.
- A person who is both an individual client and a director of a company client needs two portal logins (two email addresses): a user is an ACTIVE member of one client only. Multi-client users are phase 2.
- No cryptographic PAdES seal; integrity is hash-based and recorded in append-only tables.
- Remote e-signature of Form 8878/8879 is switched off until a third-party KBA provider is integrated (`ESIGN_IRS_REMOTE_ENABLED`); the print-sign-upload route uses the existing document-request upload and is the correct IRS route today.
- Rate limiting is per serverless instance (existing portal limitation); the OTP's 5-attempt / 10-minute / 1-in-1,000,000 design does not depend on it.
