-- =====================================================================
-- Test ID  : T-DB-TXN-005
-- Req      : FR-005, FR-006 (Failed transactions don't affect balances)
-- Priority : P0
-- Purpose  : Verify failed/cancelled transactions have no ledger
--            entries and account balances reconcile with the ledger.
-- Expected : 0 rows returned from each query = PASS
-- Note     : Reconciliation assumes accounts start from a zero ledger;
--            include opening balances if your seed data has them.
-- =====================================================================

-- Part A: failed/cancelled transactions must have no ledger entries
SELECT t.id, t.status, l.id AS ledger_id
FROM transactions t
JOIN ledger l ON l.transaction_id = t.id
WHERE t.status IN ('failed', 'cancelled');

-- Part B: account balance reconciles with ledger
SELECT a.id,
       a.balance,
       SUM(l.credit) - SUM(l.debit) AS ledger_balance
FROM accounts a
JOIN ledger l ON l.account_id = a.id
GROUP BY a.id, a.balance
HAVING a.balance <> SUM(l.credit) - SUM(l.debit);
