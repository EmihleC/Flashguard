-- =====================================================================
-- Test ID  : T-DB-TXN-003
-- Req      : FR-005 (Chronological timestamp integrity)
-- Priority : P0
-- Purpose  : Verify created_at <= authorized_at <= settled_at wherever
--            those values exist.
-- Expected : 0 rows returned (no out-of-order timestamps) = PASS
-- =====================================================================
SELECT id, created_at, authorized_at, settled_at
FROM transactions
WHERE (authorized_at IS NOT NULL AND authorized_at < created_at)
   OR (settled_at IS NOT NULL AND authorized_at IS NOT NULL AND settled_at < authorized_at)
   OR (settled_at IS NOT NULL AND settled_at < created_at);
