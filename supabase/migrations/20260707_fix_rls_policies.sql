-- ============================================================
-- Migration: Fix RLS policies — split by operation
-- Applied: 2026-07-07
-- ============================================================
-- Problem: FOR ALL with USING(client OR admin) + WITH CHECK(admin only)
-- still allows clients to DELETE their own rows because WITH CHECK
-- is not applied to DELETE operations.
-- Fix: separate SELECT (client/admin) from write ops (admin only).
-- ============================================================

-- ── rental_history ───────────────────────────────────────────
DROP POLICY IF EXISTS rental_history_access ON rental_history;

-- Clients can read their own history; admins can read all
CREATE POLICY "rental_history_select" ON rental_history
  FOR SELECT TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can write (insert / update / delete)
CREATE POLICY "rental_history_write" ON rental_history
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── generated_documents ──────────────────────────────────────
DROP POLICY IF EXISTS generated_docs_access ON generated_documents;

-- Clients can read their own documents; admins can read all
CREATE POLICY "generated_docs_select" ON generated_documents
  FOR SELECT TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can write
CREATE POLICY "generated_docs_write" ON generated_documents
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
