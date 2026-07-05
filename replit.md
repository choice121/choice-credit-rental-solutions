# Choice Credit and Rental Solutions

A full-stack credit and rental approval consulting platform that guides clients from denied to approved — with a public marketing site, client portal, and admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/choice-credit run dev` — run the frontend (port 24684)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4
- API: Express 5 (artifacts/api-server)
- DB & Auth: Supabase PostgreSQL + Supabase Auth
- ORM: @supabase/supabase-js service role client (NOT Drizzle)
- API codegen: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- Deployment: Cloudflare Pages (frontend) — choice-credit-rental-solutions.pages.dev

## Where things live

- `artifacts/choice-credit/` — React + Vite frontend
- `artifacts/api-server/` — Express backend API
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for API)
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks
- `artifacts/api-server/src/routes/` — backend route handlers
- `artifacts/api-server/src/lib/supabase.ts` — Supabase service role client
- `artifacts/api-server/src/lib/auth-middleware.ts` — JWT auth middleware
- `artifacts/choice-credit/src/lib/auth.tsx` — Supabase AuthProvider + hooks
- `artifacts/choice-credit/src/lib/supabase.ts` — Supabase browser client

## Architecture decisions

- **No Drizzle ORM** — backend uses @supabase/supabase-js with service role key for all DB operations
- **Supabase Auth** — JWT tokens from Supabase are validated in the backend auth middleware using the anon key
- **Payment methods are selection-only** — no actual payment processing; 6 methods (Cash App, PayPal, Zelle, Apple Pay, Google Pay, Venmo) stored in payment_selections table; advisor contacts client with details
- **Google Apps Script email** — planned for notification emails; NOT Resend or SendGrid
- **Cloudflare Pages** — frontend deploys automatically on push to main branch of the GitHub repo

## Product

- **Public marketing site**: Home, Services (3 packages), Tradeline Calculator, Book Consultation, Contact
- **Client portal**: Dashboard, Documents (upload/track), Approval Plan, Messages (real-time thread with advisor), Billing (payment method selection)
- **Admin dashboard**: Stats overview, Client management, Leads pipeline, Message inbox, Revenue breakdown

## Packages (seeded in DB)

| Tier | Name | Price |
|------|------|-------|
| Starter | Readiness Report | $149 |
| Standard | Guided Approval Package | $349 |
| Premium | Full-Service Approval | $649 |

## User preferences

- Supabase for auth and DB (not Replit DB or Drizzle)
- Email via Google Apps Script (not Resend)
- Payment method modal only — no actual payment processing
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
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
