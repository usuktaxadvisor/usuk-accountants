# Authentication

Auth.js (NextAuth v5), JWT strategy, 8-hour httpOnly sameSite cookies signed with `AUTH_SECRET`. **Invitation-only**: no self-registration route exists anywhere. Passwords: bcrypt cost 12, minimum 10 chars, set only via a single-use emailed link (32 random bytes; only its SHA-256 stored; 7-day expiry). Roles CLIENT/STAFF/ADMIN travel in the token and are re-verified server-side on every protected op (`requireRole`), never by UI alone. Login attempts (success and failure) are audit-logged. Logout invalidates via cookie clearing + short session lifetime. First admin: `/api/portal/bootstrap?key=<derived>&email=…` — works only while the users table is empty, permanently sealed after.
2FA (TOTP) is a planned phase-2 addition on the same provider.
