-- =====================================================================
-- Test ID  : T-DB-TXN-002
-- Req      : FR-005 (Transaction Data Integrity)
-- Priority : P0
-- Purpose  : Verify transaction status only holds valid values and
--            progresses forward: pending -> completed -> settled
--            (or pending -> failed/cancelled).
-- Expected : 0 rows returned from each query = PASS
-- =====================================================================

-- Part A: no invalid status values
SELECT id, status
FROM transactions
WHERE status NOT IN ('pending', 'completed', 'settled', 'failed', 'cancelled');

-- Part B: no invalid transitions (only if a status history table exists)
SELECT h.transaction_id, h.old_status, h.new_status
FROM transaction_status_history h
WHERE NOT (   (h.old_status = 'pending'   AND h.new_status IN ('completed', 'failed', 'cancelled'))
           OR (h.old_status = 'completed' AND h.new_status = 'settled'));
