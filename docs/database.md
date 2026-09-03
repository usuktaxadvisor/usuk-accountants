# Database

Neon Postgres (EU) via Drizzle ORM (chosen over Prisma: pure-TS, no engine binaries, lighter serverless cold starts). Schema in `src/lib/portal/db/schema.ts`; migration SQL in `drizzle/`. Apply with `npx drizzle-kit migrate` (or `push` for first setup). Entities: users, clients (Drive folder IDs live here, server-side only), invitations (token hashes), document_requests, documents, audit_logs. All IDs are UUIDs; nothing internal is ever serialised to the browser.
