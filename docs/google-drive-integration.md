# Google Drive Integration

- Cloud project `usuk-client-portal`, OAuth client "portal-server".
- **Scope: `drive.file` only** — the app can see/touch nothing except folders and files it created itself. A leaked token cannot read the wider Drive.
- Server holds one refresh token (`GOOGLE_REFRESH_TOKEN`) for hello@usukaccountants.com, minted once via `/api/auth/google/start?key=<AUTH_SECRET-derived>` → Google consent → callback shows the token exactly once for manual placement into Vercel env. The app never stores it.
- Folder tree (created idempotently on first need): `USUK Accountants Portal / Clients / [CL-ref — Name] / Incoming Documents | Processed Documents`. IDs cached in the DB, never exposed.
- No public folders, no "anyone with link", no Drive URLs to clients — ever. Future client downloads must stream through an authenticated server route.
