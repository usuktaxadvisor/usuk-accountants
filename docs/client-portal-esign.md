# Client portal — e-signature & approval module

Branch `feat/portal-esign`. Extends the existing staff → client **deliveries** workflow with an evidence-backed, in-portal review / approve / sign flow. Nothing in the existing portal is redesigned; the module hangs off `deliveries` and the existing auth, Drive storage, email and audit modules.

## 1. Architecture decision

**Native implementation (Option A), with document-type controls and a pluggable identity-verification step for IRS e-file authorisations.**

Why native rather than an embedded provider (DocuSign / Dropbox Sign / Adobe Sign / SignWell):

| Criterion | Native (chosen) | Embedded provider |
|---|---|---|
| UK validity (ECA 2000 s.7, UK eIDAS, Law Commission 2019) | Simple e-signature with intent, attribution and integrity evidence — sufficient for engagement letters, approvals, declarations | Same tier (simple / advanced) unless a qualified certificate is bought |
| US validity (ESIGN 15 U.S.C. §7001; UETA) | Consent + intent + attribution + record retention — all captured | Same |
| IRS Forms 8878/8879 remote e-sign (Pub. 1345) | Needs IAL2 identity verification (third-party KBA or equivalent). Not provided by portal login → **document-type control**: blocked unless a recorded verification exists; handwritten print-sign-upload route otherwise | Only providers with an IRS-KBA add-on satisfy this; still requires a paid ID-check per signer |
| Evidence | SHA-256 of frozen original and sealed PDF; append-only, hash-chained event log (DB triggers forbid UPDATE/DELETE); versioned consent text hash; email OTP re-auth; IP/UA; JSON certificate + PDF rendering | Provider certificate of completion (comparable), but held by a third party |
| Data residency / sub-processors | Tax documents never leave Neon + the firm's Drive | Full return PDFs sent to a US SaaS; AI/data-use terms to review |
| Client experience | Never leaves usukaccountants.com; no extra account | Embedded signing iframe, provider branding limits on cheaper tiers |
| Cost | £0 per envelope; no monthly minimum | Typically $10–$40/user/month plus per-envelope fees; KBA $2–$5 per check |
| Webhooks / replay risk | None to secure | Signature verification, idempotency, replay protection required |
| Cryptographic PAdES seal | Not applied (hash-based integrity instead) | Applied by provider |

The one thing a provider gives that we cannot build ourselves is third-party KBA. That is isolated behind `identity_verifications` so a KBA vendor (or DocuSign ID Verification) can be added later without touching the signing flow.

## 2. Legal / regulatory research (verified 27–28 Sep 2026)

- **UK** — Electronic Communications Act 2000 s.7 (admissibility of electronic signatures); UK eIDAS (Reg. 910/2014 retained and amended by SI 2019/89) tiers simple/advanced/qualified; Law Commission *Electronic execution of documents* (Sept 2019): an electronic signature is valid where there is an intention to authenticate — typed names and "I accept" buttons upheld. Deeds and wills have witnessing formalities and are out of scope. HMRC 64-8 / agent authorisations are handled online by HMRC's own services; no HMRC form in our workflow requires a wet signature.
- **UK GDPR / ICO** — signature evidence (IP, user agent, timestamps, login identity) is personal data processed under legitimate interests / legal obligation (evidencing consent and contract). It is minimised (no document contents in events, no ID numbers in IDV notes), retained with the engagement record, and disclosed to the client in the consent text.
- **US** — ESIGN Act 15 U.S.C. §7001 et seq. and UETA: a signature may not be denied effect because it is electronic; consumer consent to electronic records; records must be retained in a form accurately reproducible. Implemented by the versioned consent text, the sealed PDF and the JSON certificate.
- **IRS** — Publication 1345 (Rev. 10-2024) and the *IRS e-file Signature Authorization FAQs*: Forms 8878/8879 may be e-signed if the software provides it; a **remote** e-signature requires identity verification to NIST SP 800-63 IAL2 (third-party KBA, with exceptions for in-person verification and a verified multi-year relationship); the ERO must retain the digital image of the signed form, date/time, IP address, login identification, and the identity-verification result. A handwritten signature on 8879 returned via an internet website is **not** a remote e-signature and needs no KBA. ERO retention of Form 8879: three years from the return due date or filing date, whichever is later. Practitioner records generally: IRS Circular 230 §10.28/10.34 duties; retain workpapers per firm policy (we use 7 years).
- **Professional** — ACCA and ICAEW guidance accepts electronic engagement letters and approvals; AML record retention 5 years after the relationship ends (MLR 2017 reg. 40).

Sources: IRS Pub. 1345; irs.gov *Frequently asked questions for IRS e-file signature authorization*; AICPA comment letter to IRS (June 2020) summarising the KBA requirement; legislation.gov.uk ECA 2000 s.7; Law Commission report 2019; gov.uk UK eIDAS guidance.

## 3. Database changes (`drizzle/0002_portal_esign.sql`)

New enums `sig_action`, `sig_request_status`, `sig_signer_status`, `sig_field_type`, `sig_doc_kind`, `idv_method`. New tables:

- `signature_requests` — the envelope: client, title, action (APPROVAL / SIGNATURE / APPROVAL_AND_SIGNATURE), doc kind, signing order, status, due/expiry, consent version, sealed/evidence Drive ids + hashes.
- `signature_request_documents` — which delivery version(s) are in the envelope, with `frozen_sha256` computed at creation.
- `signature_signers` — one row per signer (portal user) with their own view/consent/OTP/approve/sign timestamps, method, IP, UA, auth method, optional identity-verification link.
- `signature_fields` — placed fields (SIGNATURE / INITIALS / DATE / NAME / CHECKBOX / ACKNOWLEDGEMENT) in page-percentage coordinates; page `9999` = last page preset, `0` = signing record page.
- `signature_events` — **append-only**, hash-chained (`prev_hash`, `hash`); DB trigger rejects UPDATE/DELETE.
- `signature_evidence` — the JSON certificate + its SHA-256 (append-only trigger).
- `esign_consents` — every consent acceptance with version and text hash (append-only trigger).
- `identity_verifications` — IRS Pub. 1345 verification record (method, verifier, provider ref, validity). No ID numbers.

Existing tables are untouched. `deliveries` remains the document store; the original Drive file is never modified.

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
- **Replay** — OTP hash is cleared on success; signer step checks (`nextSignerStep`) reject repeats; rate limits on every route.
- **CSRF** — JSON POSTs with same-origin cookies under Auth.js CSRF protection; no HTML forms.
- **XSS** — React escaping; PDFs served with `sandbox` CSP and `nosniff`; emails escape user text.
- **Malicious PDFs** — only `application/pdf` deliveries can be sent for signature; pdf-lib parses server-side; viewer is sandboxed.
- **Admin impersonation** — staff never sign for clients; a signer row must belong to a CLIENT user of that client.
- **Multiple tabs / stale sessions** — every action re-loads state and checks the step; stale actions get 409.
- **Tamper-evident log** — hash chain + DB triggers.

## 7. Notifications

Request email, reminders (cron: every 3 days while open, plus a due-date reminder — never more), OTP email, completion email; staff alerts on decline / partial / completion. No document is ever attached.

## 8. Retention

Evidence rows are append-only and never deleted by the application. Recommended firm policy: keep original, sealed PDF, evidence certificate and event log for **7 years** after the end of the engagement (covers IRS 3-year 8879 retention, HMRC 6-year enquiry window for individuals, MLR 5-year AML retention). Drive files are under the firm's own Google Workspace retention.

## 9. Staff workflow

Clients → client → *Work for client review* → upload the PDF (existing) → **Require client action** → choose action, document type, documents, signature placement preset, optional acknowledgement, message, due date → *Send to client*. For Form 8878/8879 first **Record identity verification** (method, no ID numbers). Dashboard: *Signatures & approvals* (filter by status, search). Record page: frozen hashes, signers, event log with chain check, *View signature record (JSON)*, *Download evidence certificate*, *Download signed PDF*, *Void*.

## 10. Client workflow

Email → portal → *Documents requiring your action* → **Review & sign** → read/download → tick reviewed → accept consent → enter emailed code → approve → type or draw signature → *Sign now* → done → *Download signed copy* / *Download signature record*. Works on mobile (pointer events, responsive layout). Decline with a reason is available at every step.

## 11. Testing

`npm test` — 56 tests: workflow rules, hash chain (tamper/reorder/delete detection), IRS gate, OTP, signature input validation, evidence certificate, PDF sealing on a synthetic document, and a pure-rule simulation of scenarios 1–8 and 11 from the brief. Scenarios 9, 10, 12, 13, 16 and 17 are integration behaviours (expired link → 409; foreign client → 404; no webhooks/provider exist; downloads; mobile) to be exercised on the preview deployment with a synthetic client before real use. `ESIGN_DEMO_OUT=<dir> npx vitest run tests/esign-demo.render.test.ts` renders the demo artefacts.

## 12. Deployment / configuration

1. Merge `feat/portal-esign`; Vercel builds as usual (`pdf-lib` added as a dependency).
2. Apply `drizzle/0002_portal_esign.sql` to Neon (same procedure as 0001).
3. Add env var `CRON_SECRET` (random string) in Vercel; `vercel.json` schedules `/api/portal/esign/cron` daily at 08:00 UTC.
4. No other credentials. No provider account.
5. Test on Preview with a synthetic client (TEST CLIENT — Jane Smith) before any real request.

## 13. Costs

One-time: none. Recurring: none beyond existing Neon, Vercel, Resend and Google Workspace. Per signature: £0. Optional later: KBA provider for remote Form 8879 signing (typically $2–5 per check).

## 14. Disaster recovery / retrieving evidence years later

Everything needed is in two places the firm already controls: the Neon database (requests, signers, events, JSON certificate, consents, IDV) and the client's *Processed Documents* Drive folder (original, `*_SIGNED_*.pdf`, `*_EVIDENCE_*.pdf`). To prove a signature: open the staff record page or query `signature_requests` by client/title; download the JSON certificate; recompute the hashes with `sha256sum` on the Drive files and compare; the event chain is self-verifying. Neon point-in-time restore and Drive version history are the backups.

## 15. Known limits / phase 2

- Field placement uses presets (bottom-left / bottom-right of last page / signing page); drag-and-drop placement on a rendered page is phase 2.
- Multiple signers require each signer to have their own portal user linked to the same client (joint-signer setup); the staff form sends to the client's primary user by default.
- No cryptographic PAdES seal; integrity is hash-based and recorded in append-only tables.
- Remote e-signature of Form 8878/8879 requires a recorded identity verification; the print-sign-upload route uses the existing document-request upload.
