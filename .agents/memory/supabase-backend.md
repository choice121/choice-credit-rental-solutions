---
name: Supabase backend pattern
description: How auth and DB access work in this project (no Drizzle, service role client, JWT auth middleware).
---

## Rule
This project does NOT use Drizzle ORM. All database operations in the Express backend use `@supabase/supabase-js` with the service role key.

- Backend: `artifacts/api-server/src/lib/supabase.ts` — singleton service role client
- Frontend: `artifacts/choice-credit/src/lib/supabase.ts` — anon key browser client
- Auth middleware: validates JWTs by calling `client.auth.getUser(token)` using the anon key (creates a per-request Supabase client)
- User role is stored in `app_metadata.role` or `user_metadata.role` on the Supabase user object

**Why:** The user explicitly chose Supabase for both auth and DB. Using the service role client in the backend bypasses RLS for admin operations while the frontend uses RLS through the anon key.

**How to apply:** For new backend routes, import `supabase` from `../lib/supabase` and use the `requireAuth` / `requireAdmin` middleware from `../lib/auth-middleware`. Do not add Drizzle schema files.
