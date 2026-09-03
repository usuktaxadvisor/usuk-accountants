# Staff Workflow

1. `/portal/admin` → **New client** (name + email) → record created (auto ref CL-000n), activation email sent via Resend; a visible warning appears if the email fails so you can re-invite.
2. Open the client → **Request document** (title + optional instruction). Client sees it instantly.
3. Client uploads → status flips to UPLOADED; the admin home shows an awaiting-review count; the file is in their Drive Incoming folder under `YYYY-MM-DD_originalname`.
4. Review → set RECEIVED / UNDER_REVIEW / COMPLETED from the dropdown.
Passwords are never handled by staff; resets = fresh invitation (re-invite flow to be added alongside suspend/deactivate buttons — schema already supports the states).
