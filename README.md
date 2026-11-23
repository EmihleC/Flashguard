# Flash-capstone-project

### P0 Test 8 — Verify Failed Transactions Do Not Affect Balances

**Test data:** Transaction ID 3, Alice (account 1) to Charlie (account 3), amount R15,000.00.

**Precondition:** The transfer exceeds the R10,000 AML threshold.

**Expected result:**
- Transaction status is `rejected`.
- Compliance flag is `aml`.
- No debit or credit ledger entries are created.
- Account balances are not updated by the rejected transfer.
- A compliance-block event is recorded in the audit log.

**Actual result:**
- Transaction status: `rejected`.
- Compliance flag: `aml`.
- Ledger entry count: 0.
- Total debits: R0.00.
- Total credits: R0.00.
- Audit event: `compliance_blocked`, audit ID 15.
- Source-code review confirms that the AML rejection path does not post balance updates or ledger entries.

**Result: PASS — AML rejection scenario.**

**Evidence limitation:** Historical before-and-after balance snapshots were not available to independently prove the absence of every possible balance change. The conclusion is supported by the current database state and the reviewed application code.

# Report
The query compares each account's current balance with its net ledger balance. 

| Field              | Meaning                                  |
| :----------------- | :--------------------------------------- |
| current_balance    | Balance stored in dbo.accounts           |
| net_ledger_balance | Total credits minus total debits         |
| balance_difference | Current balance minus net ledger balance |

Expected result: The difference should be zero if the ledger includes the opening balance and all subsequent movements.

Your current result: The check is PENDING INVESTIGATION, not a confirmed pass or fail. The opening balances were seeded directly into the accounts table without matching opening ledger entries, so the two values are not yet directly comparable.

For example, Alice's balance was initially R10,000, but the opening amount wasn't represented in the ledger. After the successful R10 transfer to Bob, Alice's balance became R9,990 and Bob's became R2,510.