# Deployment

Branch `feat/client-portal`; merge to `main` deploys via existing Vercel pipeline. Required env vars (Production + Preview): `AUTH_SECRET` (openssl rand -base64 32), `AUTH_URL` (https://www.usukaccountants.com), `DATABASE_URL` (Neon, sslmode=require), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `PORTAL_FROM_EMAIL`, `UPLOAD_MAX_MB` (25). Existing marketing vars untouched. Order: set env → apply DB migration → deploy → bootstrap first admin → mint Drive token via consent link → live verification with a test client → flip header link → remove test data.
Build: `npm run build`. Tests: `npm test`. Lint: `npm run lint`.
