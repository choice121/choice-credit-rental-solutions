-- ============================================================
-- Migration: Deactivate legacy Choice Credit packages/add-ons
-- Applied: 2026-07-08
-- ------------------------------------------------------------
-- The full package catalog has been replaced by the IES-aligned
-- lineup: Approval Assessment, Standard Housing Package,
-- Expedited Housing Package, Co-Signer Program, and Instant
-- Approval Service. This migration deactivates the older
-- consulting-tier packages and unrelated add-ons so they no
-- longer appear on the public site or in booking flows.
-- Rows are kept (not deleted) to preserve history for any
-- existing cases/invoices that reference them.
-- ============================================================

UPDATE packages
SET is_active = false
WHERE slug IN (
  'readiness-report',
  'guided-approval',
  'full-service-approval',
  'rental-history',
  'car-approval',
  'expedited-review',
  'tradeline'
)
OR name IN (
  'Readiness Report',
  'Guided Approval Package',
  'Full-Service Approval',
  'Rental History Verification',
  'Car Approval Package',
  'Expedited Review',
  'Additional Tradeline'
);
