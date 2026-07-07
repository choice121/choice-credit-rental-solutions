# GitHub Copilot Instructions — Choice Credit and Rental Solutions

## Architecture Is Locked — Do Not Migrate

This project's production stack is fixed and must not be changed:

- **Database / Auth / Storage:** Supabase
- **Email:** Google Apps Script (GAS_EMAIL_URL webhook)
- **Deployment:** Cloudflare Pages
- **Dev environment:** Replit (editor only, not production infrastructure)

## Hard Rules

- Never replace Supabase with Replit Database, Neon, Firebase, or anything else
- Never replace Supabase Auth with Replit Auth, Clerk, or NextAuth
- Never add `@replit/database` or `@replit/object-storage`
- Never expose SUPABASE_SERVICE_ROLE_KEY in VITE_ variables
- Never replace GAS email with Resend or SendGrid
- Never change deployment away from Cloudflare Pages

## Protected Files

These files must not be deleted or rewritten to use a different provider:
- `artifacts/api-server/src/lib/supabase.ts`
- `artifacts/api-server/src/lib/auth-middleware.ts`
- `artifacts/choice-credit/src/lib/supabase.ts`
- `artifacts/choice-credit/src/lib/auth.tsx`

## Reference

Full specification: `ARCHITECTURE.md`
