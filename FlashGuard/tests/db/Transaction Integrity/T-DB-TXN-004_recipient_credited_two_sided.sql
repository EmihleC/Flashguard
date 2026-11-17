-- =====================================================================
-- Test ID  : T-DB-TXN-004
-- Req      : FR-003, FR-005 (Two-sided ledger entry)
-- Priority : P0
-- Purpose  : Verify each completed/settled transaction has exactly one
--            debit entry (sender) and one credit entry (recipient).
-- Expected : 0 rows returned (every transaction is two-sided) = PASS
-- =====================================================================
SELECT t.id,
       t.amount,
       SUM(CASE WHEN l.debit  > 0 THEN 1 ELSE 0 END) AS debit_entries,
       SUM(CASE WHEN l.credit > 0 THEN 1 ELSE 0 END) AS credit_entries
FROM transactions t
LEFT JOIN ledger l ON l.transaction_id = t.id
WHERE t.status IN ('completed', 'settled')
GROUP BY t.id, t.amount
HAVING SUM(CASE WHEN l.debit  > 0 THEN 1 ELSE 0 END) <> 1
    OR SUM(CASE WHEN l.credit > 0 THEN 1 ELSE 0 END) <> 1;
