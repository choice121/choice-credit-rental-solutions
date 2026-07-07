---
name: Document Generator Feature
description: PDF generation feature for Choice Credit & Rental Solutions — architecture decisions and known quirks.
---

# Document Generator Feature

## Architecture
- **Library**: `@react-pdf/renderer` — client-side, no server changes needed. `pdfRenderer(doc).toBlob()` generates the blob; `PDFDownloadLink` handles in-browser download.
- **Tables**: `rental_history` and `generated_documents` — direct Supabase queries (not the API layer) since they're outside the existing API spec.
- **Admin route**: `/admin/documents` — lazy-loaded, nav item in AdminLayout.
- **Client route**: `/portal/documents` — updated with "Prepared for You" tab showing `generated_documents`.

## Save pipeline (handleSaveToProfile)
1. `pdfRenderer(pdfDocument as any).toBlob()` — generate PDF blob
2. Upload blob to Supabase Storage `documents` bucket at `generated/{clientId}/{timestamp}-{filename}`
3. `saveGeneratedDocument(...)` with `file_url` — saves metadata row in DB
Clients see a Download button only if `file_url` exists on the row.

## RLS policy pattern
Both tables use **split policies** (not `FOR ALL`):
- `SELECT`: client (own rows) OR admin
- `ALL` (write): admin only
**Why**: `FOR ALL` with `USING(client OR admin)` + `WITH CHECK(admin only)` silently allows client DELETEs because `WITH CHECK` is not applied to DELETE. Separate SELECT vs write policies close this.

## Known quirks
- `CreditDisputeLetterPDF` uses `clientFullAddress` (single string, comma-separated) — parsed with `.split(",")` for multi-line rendering. Do not add separate city/state fields to this template.
- Income verification threshold: `monthlyRent * 3` (3× rule). Copy and logic are in sync.
- Prefill race condition fix: useEffect for form prefill depends on `historyLoading` (not `rentalHistory` array), so it triggers once after history finishes loading — avoids resetting a partially-filled form on every CRUD op.
- `@react-pdf/renderer` bundle is ~1.9 MB gzipped to ~565 KB — expected because of embedded fonts/WASM. Chunk size warning is cosmetic.
- `lib/api-client-react/dist/index.d.ts` is missing from dist (only `index.d.ts.map` present); pre-existing TS6305 errors in many pages are not new and don't block Vite.

## Migration files
- `supabase/migrations/20260707_rental_history_and_generated_docs.sql` — initial tables + indexes
- `supabase/migrations/20260707_fix_rls_policies.sql` — RLS split-policy fix (applied same day)
Both applied to project `fahzqjhwhzdgswtfvjks`.
