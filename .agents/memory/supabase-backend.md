---
name: Supabase backend pattern
description: How the backend connects to Supabase, how auth works, and key DB schema decisions made during setup.
---

## Connection pattern
- Backend uses service role client directly (lib imported from `artifacts/api-server/src/lib/supabase.ts`)
- Frontend uses anon key via AuthProvider
- JWT validated in auth-middleware with anon key (`requireAuth`)
- Admin guard via `requireAdmin` (checks `req.userRole === "admin"` set from `user.app_metadata.role`)
- `AuthRequest` extends Request with `userId?: string` and `userRole?: string` — NOT `user` — use `req.userId!` not `req.user!.id`

## Required secrets
- `SUPABASE_URL` — non-sensitive, set as shared env var
- `VITE_SUPABASE_URL` — non-sensitive, set as shared env var
- `SUPABASE_SERVICE_ROLE_KEY` — secret
- `SUPABASE_ANON_KEY` — secret
- `VITE_SUPABASE_ANON_KEY` — secret

## packages table schema (as of 2026-07-06)
- Columns added: `slug TEXT`, `category TEXT`, `price_label TEXT`
- `price` is nullable (for variable-price services like "Varies" or "$2,500–$2,800")
- `tier` CHECK constraint expanded to: `starter | standard | premium | profile_standard | profile_expedited | done_for_you | addon`
- 12 packages seeded across 4 categories

## add_ons table (case-level add-on tracking)
- Created in migration `20260706_add_ons_and_full_packages.sql`
- Columns: `id`, `case_id` (FK → cases), `package_id` (nullable FK → packages), `name`, `price`, `status` (active/completed/cancelled), `notes`, `added_at`, `updated_at`
- Backend routes in `artifacts/api-server/src/routes/add-ons.ts`
- Response shape: camelCase (`caseId`, `packageId`, `addedAt`, `updatedAt`) — always map with `mapAddOn()` helper

**Why:** Supabase returns snake_case columns; OpenAPI/generated client expects camelCase. Always map DB rows in routes, never pass raw DB objects to the response.
