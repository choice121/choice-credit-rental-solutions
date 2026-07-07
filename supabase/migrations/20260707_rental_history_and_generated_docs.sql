-- ============================================================
-- Migration: Rental History + Generated Documents
-- Applied: 2026-07-07
-- ============================================================

-- ── rental_history ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rental_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL DEFAULT 'GA',
  zip_code        TEXT,
  move_in_date    DATE NOT NULL,
  move_out_date   DATE,
  is_current      BOOLEAN NOT NULL DEFAULT false,
  monthly_rent    NUMERIC(10,2),
  landlord_name   TEXT,
  landlord_phone  TEXT,
  landlord_email  TEXT,
  reason_for_leaving TEXT,
  payment_history TEXT NOT NULL DEFAULT 'good'
    CHECK (payment_history IN ('excellent','good','fair','poor')),
  had_eviction    BOOLEAN NOT NULL DEFAULT false,
  eviction_explanation TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rental_history_client_id
  ON rental_history(client_id);
CREATE INDEX IF NOT EXISTS idx_rental_history_move_in_date
  ON rental_history(move_in_date DESC);

-- ── generated_documents ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS generated_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type   TEXT NOT NULL,
  document_name   TEXT NOT NULL,
  data_snapshot   JSONB,
  file_url        TEXT,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generated_docs_client_id
  ON generated_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_generated_docs_created_at
  ON generated_documents(created_at DESC);

-- ── Updated_at trigger ───────────────────────────────────────
CREATE TRIGGER set_updated_at_rental_history
  BEFORE UPDATE ON rental_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE rental_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Clients can view their own; admins can do everything
CREATE POLICY "rental_history_access" ON rental_history
  FOR ALL TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "generated_docs_access" ON generated_documents
  FOR ALL TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
