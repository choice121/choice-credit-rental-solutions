-- ============================================================
-- Migration: Fix missing tables, RLS policies, and soft-delete columns
-- Applied: 2026-07-08
-- ============================================================

-- ── payment_selections ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_selections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'payment_selections' AND policyname = 'clients_own_payment_selections'
  ) THEN
    CREATE POLICY "clients_own_payment_selections" ON payment_selections
      FOR ALL USING (
        invoice_id IN (SELECT id FROM invoices WHERE client_id = auth.uid())
      );
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'payment_selections' AND policyname = 'admin_all_payment_selections'
  ) THEN
    CREATE POLICY "admin_all_payment_selections" ON payment_selections
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END;
$$;

-- ── approval_plans ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Your Approval Plan',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE approval_plans ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'approval_plans' AND policyname = 'clients_view_own_plans'
  ) THEN
    CREATE POLICY "clients_view_own_plans" ON approval_plans
      FOR SELECT USING (
        case_id IN (SELECT id FROM cases WHERE client_id = auth.uid())
      );
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'approval_plans' AND policyname = 'admin_all_plans'
  ) THEN
    CREATE POLICY "admin_all_plans" ON approval_plans
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END;
$$;

-- ── plan_steps ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES approval_plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  "order" integer NOT NULL DEFAULT 0,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plan_steps ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'plan_steps' AND policyname = 'clients_view_own_steps'
  ) THEN
    CREATE POLICY "clients_view_own_steps" ON plan_steps
      FOR SELECT USING (
        plan_id IN (
          SELECT ap.id FROM approval_plans ap
          JOIN cases c ON ap.case_id = c.id
          WHERE c.client_id = auth.uid()
        )
      );
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'plan_steps' AND policyname = 'admin_all_steps'
  ) THEN
    CREATE POLICY "admin_all_steps" ON plan_steps
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END;
$$;

-- ── rental_history: soft-delete column ──────────────────────
ALTER TABLE rental_history ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- ── newsletter_subscribers ───────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'newsletter_subscribers' AND policyname = 'admin_all_newsletter'
  ) THEN
    CREATE POLICY "admin_all_newsletter" ON newsletter_subscribers
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END;
$$;
