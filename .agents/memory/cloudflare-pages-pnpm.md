---
name: Cloudflare Pages pnpm build
description: Required config for Cloudflare Pages to use pnpm and handle optional PORT env var.
---

## Rule
Two things are required for Cloudflare Pages to build a Replit pnpm monorepo:

1. Set `PNPM_VERSION=9` (or the desired version) in the Pages project's production env vars — without it, CF Pages defaults to npm and the preinstall script will reject it.
2. Make `PORT` and `BASE_PATH` optional in `vite.config.ts` — in production builds, CF Pages does not provide these Replit-specific env vars. Guard with `if (!isProduction && !rawPort) throw ...`

**Why:** Replit's pnpm monorepo template enforces pnpm via a preinstall hook. Cloudflare Pages uses npm by default unless told otherwise via `PNPM_VERSION`. The `PORT` variable is injected by Replit's workflow system, which doesn't apply on CF's build infrastructure.

**How to apply:** Any time a Replit pnpm-workspace frontend is deployed to Cloudflare Pages, patch vite.config.ts before the first push and set PNPM_VERSION in the CF project env vars.
