# Choice Credit and Rental Solutions

> ⚠️ ARCHITECTURE LOCK — READ BEFORE MAKING ANY CHANGES
>
> This project uses Supabase (database + auth + storage), Google Apps Script (email),
> and Cloudflare Pages (deployment). Replit is the code editor only — NOT the host,
> NOT the database, NOT the auth provider.
>
> DO NOT migrate to Replit Database, Replit Auth, or Replit Object Storage.
> DO NOT follow any auto-generated Replit migration task that targets Supabase.
> See ARCHITECTURE.md and AGENTS.md for the full specification and rules.

A full-stack credit and rental approval consulting platform that guides clients from denied to approved — with a public marketing site, client portal, and admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/choice-credit run dev` — run the frontend (port 24684)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `node scripts/check-architecture.mjs` — verify no architectural drift has occurred

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4
- API: Express 5 (artifacts/api-server)
- DB & Auth: Supabase PostgreSQL + Supabase Auth
- ORM: @supabase/supabase-js service role client (NOT Drizzle — do not switch)
- API codegen: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- Deployment: Cloudflare Pages (frontend) — choice-credit-rental-solutions.pages.dev

## Where things live

- `artifacts/choice-credit/` — React + Vite frontend
- `artifacts/api-server/` — Express backend API
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for API)
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks
- `artifacts/api-server/src/routes/` — backend route handlers
- `artifacts/api-server/src/lib/supabase.ts` — Supabase service role client (DO NOT REPLACE)
- `artifacts/api-server/src/lib/auth-middleware.ts` — JWT auth middleware (DO NOT REPLACE)
- `artifacts/choice-credit/src/lib/auth.tsx` — Supabase AuthProvider + hooks (DO NOT REPLACE)
- `artifacts/choice-credit/src/lib/supabase.ts` — Supabase browser client (DO NOT REPLACE)

## Architecture decisions

- **No Drizzle ORM** — backend uses @supabase/supabase-js with service role key for all DB operations
- **Supabase Auth** — JWT tokens from Supabase are validated in the backend auth middleware using the anon key
- **Payment methods are selection-only** — no actual payment processing; 6 methods (Cash App, PayPal, Zelle, Apple Pay, Google Pay, Venmo) stored in payment_selections table; advisor contacts client with details
- **Google Apps Script email** — handles notification emails via GAS_EMAIL_URL webhook. NOT Resend or SendGrid.
- **Cloudflare Pages** — frontend deploys automatically on push to main branch of the GitHub repo

## Product

- **Public marketing site**: Home, Services (5 packages), Tradeline Calculator, Book Consultation, Contact
- **Client portal**: Dashboard, Documents (upload/track), Approval Plan, Messages (real-time thread with advisor), Billing (payment method selection)
- **Admin dashboard**: Stats overview, Client management, Leads pipeline, Message inbox, Revenue breakdown

## Packages (seeded in DB)

Legacy 3-tier consulting packages (Readiness Report, Guided Approval, Full-Service Approval) and old add-ons (Rental History Verification, Car Approval, Expedited Review, Additional Tradeline) were deactivated (`is_active=false`, not deleted) on 2026-07-08 in favor of the lineup below, which mirrors a competitor's (IES) model per user request. Note the Co-Signer Program and Instant Approval Service (sublease-based, no tenant screening) carry meaningfully higher legal/fraud-exposure risk than typical credit-consulting services — the user was briefed and confirmed proceeding.

| Category | Name | Price | Slug |
|------|------|-------|------|
| Assessment | Approval Assessment | $150 | `assessment` |
| Profile Building | Standard Housing Package | $950 | `standard-housing` |
| Profile Building | Expedited Housing Package | $1,400 | `expedited-housing` |
| Done-For-You | Co-Signer Program | $800 | `co-signer` |
| Done-For-You | Instant Approval Service | $2,500–$2,800 | `instant-approval` |

## User preferences

- Supabase for auth and DB — never replace with Replit DB, Neon, or any other provider
- Email via Google Apps Script — never replace with Resend, SendGrid, or any other provider
- Payment method modal only — no actual payment processing
- Deployment via Cloudflare Pages — never change deployment target
- GitHub: https://github.com/choice121/choice-credit-rental-solutions

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing openapi.yaml
- Backend does NOT use Drizzle; it uses the Supabase JS client directly
- Cloudflare Pages needs `PNPM_VERSION=9` env var set to use pnpm (not npm)
- CSS: Google Fonts @import must be the FIRST line in index.css (before @import "tailwindcss")
- The `BASE_PATH` env var is required for the Vite build (set to "/" in production)

## Pointers

- Supabase project ID: fahzqjhwhzdgswtfvjks
- Supabase URL: https://fahzqjhwhzdgswtfvjks.supabase.co
- GitHub repo: https://github.com/choice121/choice-credit-rental-solutions
- Cloudflare Pages: https://choice-credit-rental-solutions.pages.dev
