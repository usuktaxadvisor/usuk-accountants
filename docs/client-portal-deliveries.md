# Client portal — staff → client document review (deliveries)

Extends the client portal with the reverse workflow: staff send a prepared
document to a client, the client reviews it in the portal and approves or
requests changes, and staff see the response. Built on the existing portal —
same auth, client records, Drive integration, email, audit, validation and
rate limiting. The original client → portal → Drive request/upload workflow
is unchanged.

## Data model (migration `0001_portal_deliveries`, additive only)

- `deliveries` — one row per document version sent to a client.
  `drive_file_id` is server-side only. `version` + `supersedes_id` preserve history.
- `delivery_responses` — one row per client response (decision + comment).
  `client_id` is denormalised so isolation checks never need a join.
- `clients.processed_folder_id` — nullable; persisted on first use.
- Enums: `delivery_status` (READY_FOR_REVIEW, VIEWED, APPROVED, CHANGES_REQUESTED, WITHDRAWN),
  `delivery_decision` (APPROVED, CHANGES_REQUESTED).

Rollback: `DROP TABLE delivery_responses, deliveries; DROP TYPE delivery_decision, delivery_status; ALTER TABLE clients DROP COLUMN processed_folder_id;`

## Lifecycle

```
READY_FOR_REVIEW ─(client opens)→ VIEWED ─(approve)→ APPROVED
                                          └─(request changes)→ CHANGES_REQUESTED
                                                                  └─(staff Replace)→ new row v(n+1) READY_FOR_REVIEW; old row → WITHDRAWN
any active status ─(staff Withdraw)→ WITHDRAWN   (client can no longer open it; Drive file kept)
```
Rules live in `src/lib/portal/deliveries.ts` and are unit-tested.

## Routes (all under `/api/portal/deliveries`)

| Route | Who | Does |
|---|---|---|
| `POST /` | STAFF, ADMIN | multipart `file, clientId, title, category?, note?, supersedesId?` → validate → Drive (Processed Documents) → row → email client → audit. With `supersedesId`: Replace. |
| `GET /[id]/file[?download=1]` | CLIENT (own row only), STAFF+ | Streams the file through the server. Inline by default, attachment with `download=1`. First client open → VIEWED. |
| `POST /[id]/respond` | CLIENT (own row only) | `{decision, comment?}` → response row → status → email staff → audit. Comment required for changes. |
| `POST /[id]/withdraw` | STAFF, ADMIN | `{clientId}` → WITHDRAWN → audit. |

## Google Drive

Files go to `USUK Accountants Portal / Clients / {ref — name} / Processed Documents/`
(the folder `ensureClientFolders` already created). Scope stays `drive.file`;
the same consent and refresh token are used. Because of `drive.file`, only
files uploaded **through the portal** are readable by the portal — a file
dropped into Processed Documents by hand in Drive will not appear. That is
intended: the portal upload is the only send path.

Nothing Drive-related reaches the browser: no ids, links, `webViewLink`, or
signed URLs. The only URL a client sees is `/api/portal/deliveries/{uuid}/file`.

## Security

- Ownership: client reads/responds go through `getDeliveryForClient(clientId, id)`,
  which filters by the session's own `clientId`. Mismatch → 404 (no distinction from not-found).
- Staff loads are scoped to the client page they came from (`getDeliveryForStaff`).
- Unauthenticated → 401. Wrong role → 404 (client on staff routes) / 403 (staff route without role).
- Streamed response: `Cache-Control: private, no-store`, `nosniff`, restrictive CSP with `sandbox` on inline view.
- Validation reuses `validateUpload` (extension allow-list, MIME, magic bytes, size cap).
- Rate limits: create 60/10 min per staff user; file 120/10 min; respond 30/10 min.
- Orphan protection: if the DB insert fails after the Drive upload, the Drive file is deleted.
- Email HTML is escaped; the document is never attached or linked in email.
- Audit actions: `DELIVERY_CREATED`, `DELIVERY_REPLACED`, `DELIVERY_VIEWED`, `DELIVERY_DOWNLOADED`,
  `DELIVERY_STAFF_OPENED`, `DELIVERY_RESPONDED`, `DELIVERY_WITHDRAWN`, `DELIVERY_FAILED`.

## Known limitation (v1)

Staff uploads use the direct multipart path, so files are capped at ~4 MB by
Vercel's request-body limit (the UI blocks larger files with a clear message).
Most prepared returns and reports sit well under this. If larger deliveries
are needed, add a staff resumable path mirroring `createResumableSession`
bound to the Processed folder — the pattern already exists for client uploads.

## Staff workflow

Portal → Admin → client → **Work for client review** → title, category, optional note, file → **Send for client review**.
Row appears with status, version, View, Withdraw, and a Replace form. The client's response shows inline when it arrives.

## Client workflow

Email "Ready for your review" → log in → **Documents for your review** → View document / Download →
**Approve — looks correct** or **Request changes** (+ comment) → Submit response.
