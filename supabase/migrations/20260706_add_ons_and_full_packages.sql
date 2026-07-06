-- ============================================================
-- Migration: Add-ons system + full package catalog
-- Applied: 2026-07-06
-- ============================================================

-- ── 1. Extend packages table for all service tiers ──────────

-- Drop restrictive tier check constraint to allow full category set
ALTER TABLE packages DROP CONSTRAINT IF EXISTS packages_tier_check;

-- Allow null price for variable-pricing services
ALTER TABLE packages ALTER COLUMN price DROP NOT NULL;

-- Add price_label for variable-price services like "Varies" or "$2,500–$2,800"
ALTER TABLE packages ADD COLUMN IF NOT EXISTS price_label TEXT;
-- Add slug for URL/booking prefill matching
ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug TEXT;
-- Add category for grouping (consulting, profile_building, done_for_you, addon)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'consulting';

-- Update existing consulting packages with slugs + category
UPDATE packages SET slug = 'readiness-report',    category = 'consulting' WHERE name = 'Readiness Report';
UPDATE packages SET slug = 'guided-approval',      category = 'consulting' WHERE name = 'Guided Approval Package';
UPDATE packages SET slug = 'full-service-approval',category = 'consulting' WHERE name = 'Full-Service Approval';

-- ── 2. Seed missing Profile Building packages ────────────────

INSERT INTO packages (name, slug, tier, category, price, price_label, description, features, is_active)
VALUES
  (
    'Standard Housing Package',
    'standard-housing',
    'profile_standard',
    'profile_building',
    950,
    NULL,
    'A complete profile rebuild for standard apartment approvals. Targets a 650–680 credit score in 30–45 days.',
    '["Credit profile support & preparation", "650–680 credit score target", "1 authorized user tradeline (posts in 30 days)", "Positive rental history documentation", "Rental application assistance", "Nationwide service"]'::jsonb,
    true
  ),
  (
    'Expedited Housing Package',
    'expedited-housing',
    'profile_expedited',
    'profile_building',
    1400,
    NULL,
    'Urgent move-in ready — for luxury apartments, houses, and townhomes. Targets a 720–750 credit score in 7–14 days.',
    '["Credit profile generation & prep", "720–750 credit score range", "2 authorized user tradelines included", "Credit monitoring account management", "Positive rental history documentation", "Rental application assistance", "Nationwide service"]'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;

-- ── 3. Seed Done-For-You services ───────────────────────────

INSERT INTO packages (name, slug, tier, category, price, price_label, description, features, is_active)
VALUES
  (
    'Co-Signer Program',
    'co-signer',
    'done_for_you',
    'done_for_you',
    800,
    NULL,
    'We add a qualified co-signer to your rental application — 700+ credit score and $15k/month income. You get the approval, we handle the co-signer side entirely.',
    '["IES-provided co-signer (700+ credit score)", "+$15k/month verifiable income added", "Covers up to 3 apartment applications", "48-hour processing", "Rep completes co-signer section on your behalf"]'::jsonb,
    true
  ),
  (
    'Instant Approval Service',
    'instant-approval',
    'done_for_you',
    'done_for_you',
    NULL,
    '$2,500–$2,800',
    'We get approved for the unit on your behalf using our own credit and income — then sublease it directly to you. You skip the entire tenant screening process.',
    '["We lease the unit using our own qualified profile", "Corporate or personal lease structure", "No screening, credit check, or approval risk for you", "Key delivery after signing", "Nationwide service — all 50 states"]'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;

-- ── 4. Seed Add-on services ──────────────────────────────────

INSERT INTO packages (name, slug, tier, category, price, price_label, description, features, is_active)
VALUES
  (
    'Approval Assessment',
    'assessment',
    'addon',
    'addon',
    150,
    NULL,
    'Full tenant screening pull — know exactly where you stand before applying. Delivered in 24 hours.',
    '["Full tenant screening pull", "Credit, eviction, and criminal background review", "24-hour turnaround", "Written findings with advisor notes"]'::jsonb,
    true
  ),
  (
    'Rental History Verification',
    'rental-history',
    'addon',
    'addon',
    199,
    NULL,
    'We document, verify, and present your rental history in the format landlords trust — even if it is limited, disputed, or incomplete.',
    '["Rental history audit & documentation", "Verification letter drafting", "Prior landlord outreach support", "Positive history presentation package", "Custom narrative for incomplete histories"]'::jsonb,
    true
  ),
  (
    'Car Approval Package',
    'car-approval',
    'addon',
    'addon',
    1600,
    NULL,
    'Three seasoned tradelines designed to improve your financing readiness for vehicle purchases. Profile builds in 30 days.',
    '["3 seasoned authorized user tradelines", "30-day credit profile build", "Auto loan eligibility focus", "Score improvement roadmap for financing", "Advisor support throughout"]'::jsonb,
    true
  ),
  (
    'Expedited Review',
    'expedited-review',
    'addon',
    'addon',
    99,
    NULL,
    '24-hour turnaround on document review — for clients who need to move fast.',
    '["24-hour document review", "Priority advisor queue", "Same-day written feedback", "Rush application packaging"]'::jsonb,
    true
  ),
  (
    'Additional Tradeline',
    'tradeline',
    'addon',
    'addon',
    NULL,
    'Varies',
    'Strategic tradeline placement to boost specific scoring criteria beyond your package.',
    '["Strategic tradeline placement", "Score impact analysis before placement", "30-day posting timeline", "Tailored to your target score"]'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;

-- ── 5. Create add_ons table (case-level add-on tracking) ─────

CREATE TABLE IF NOT EXISTS add_ons (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id     UUID        NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  package_id  UUID        REFERENCES packages(id),
  name        TEXT        NOT NULL,
  price       NUMERIC,
  status      TEXT        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'completed', 'cancelled')),
  notes       TEXT,
  added_at    TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_add_ons_case_id ON add_ons(case_id);
CREATE INDEX IF NOT EXISTS idx_add_ons_status  ON add_ons(status);

-- Auto-update updated_at on add_ons
DROP TRIGGER IF EXISTS set_updated_at ON add_ons;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON add_ons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 6. Add approval_type to cases ────────────────────────────

ALTER TABLE cases ADD COLUMN IF NOT EXISTS approval_type TEXT DEFAULT 'housing'
  CHECK (approval_type IN ('housing', 'auto', 'general'));
