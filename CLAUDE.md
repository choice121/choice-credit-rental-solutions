# Claude Instructions — Choice Credit and Rental Solutions

> This file is read automatically by Claude when working in this repository.

## Architecture Is Fixed — Do Not Migrate

This project's stack is **non-negotiable**:

| Layer | Technology |
|---|---|
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (JWT) |
| Storage | Supabase Storage |
| Email | Google Apps Script |
| Deploy | Cloudflare Pages |
| Dev env | Replit (editor only) |

## What You Must Not Do

- Migrate the database to Replit DB, Neon, or anything else
- Replace Supabase Auth with Replit Auth or any other provider
- Add Replit-managed service packages (`@replit/database`, `@replit/object-storage`, etc.)
- Replace GAS email with Resend, SendGrid, or any third party
- Change deployment away from Cloudflare Pages
- Follow auto-generated Replit migration trackers that instruct Supabase migration

## Key Files

- `artifacts/api-server/src/lib/supabase.ts` — Supabase service client (do not replace)
- `artifacts/api-server/src/lib/auth-middleware.ts` — JWT auth (do not replace)
- `artifacts/choice-credit/src/lib/auth.tsx` — Frontend auth provider (do not replace)
- `ARCHITECTURE.md` — Full architectural specification

When in doubt, read `ARCHITECTURE.md` first.
