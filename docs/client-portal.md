# Client Portal — Overview

A secure, invitation-only area at `/portal` where clients see what documents the firm needs, upload them from any device, and track status. Staff manage everything at `/portal/admin`. Uploaded files land in the firm's private Google Drive; clients never see or touch Drive.

**Client journey:** invitation email → set password → dashboard ("You have N documents to upload") → tap Upload on a request → success message → status visible thereafter.

**Staff journey:** New client → invitation sent automatically → create document requests → uploads appear with Drive filenames → move status through REQUESTED → UPLOADED → RECEIVED → UNDER_REVIEW → COMPLETED.

Nothing in the marketing site was altered except (at go-live only) the header's Client Login link target.
