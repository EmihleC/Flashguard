# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: step_definition\TC-E2E-002.scenario2.spec.ts >> TC-E2E-002 @P0 @defect Scenario 2: Failed compliance check
- Location: tests\e2e\step_definition\TC-E2E-002.scenario2.spec.ts:24:1

# Error details

```
Error: API error should mention the compliance/sanction reason

expect(received).toMatch(expected)

Expected pattern: /sanction|compliance|blocked/i
Received string:  "{\"message\":\"Sender/recipient not valid\"}"
```

```
Error: Audit log should have an entry for the failed transfer attempt

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  29  |     }
  30  |   });
  31  | 
  32  |   // snapshot the DB before the transfer
  33  |   const [{ id: aliceId, balance: balanceBefore }] = await runQuery(
  34  |     `SELECT id, balance FROM accounts WHERE email = @email`, { email: EMAIL });
  35  |   const txnIdBefore = await maxId('transactions');
  36  |   const ledgerIdBefore = await maxId('ledger_entries');
  37  |   const auditIdBefore = await maxId('audit_log');
  38  | 
  39  |   await test.step('Log in as Alice', async () => {
  40  |     await page.goto(BASE_URL);
  41  |     await page.getByRole('link', { name: 'Sign In' }).click();
  42  |     await page.getByRole('textbox', { name: 'Email address' }).fill(EMAIL);
  43  |     await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  44  |     await page.getByRole('button', { name: 'Sign In' }).click();
  45  |     await expect(page.getByRole('heading', { name: 'Portfolio Overview' })).toBeVisible();
  46  |   });
  47  | 
  48  |   // Step 1: user attempts transfer to sanctioned recipient, API returns an error
  49  |   const transferResponse = await test.step('Transfer to sanctioned recipient', async () => {
  50  |     await page.getByRole('link', { name: /Transfer Funds/ }).click();
  51  | 
  52  |     await page.getByRole('radio', { name: /Alice Ledger/ }).check();                 // pay from
  53  |     await page.getByText(new RegExp(`${SANCTIONED_RECIPIENT}.*Select`)).click();     // recipient card
  54  |     await page.getByRole('spinbutton').fill('100');
  55  |     await page.getByRole('textbox', { name: /Invoice INV/ }).fill('Compliance test');
  56  | 
  57  |     // start listening right before the submit click
  58  |     const responsePromise = page.waitForResponse(
  59  |       r => r.request().method() === 'POST' && r.url().includes('/transactions/transfer'),
  60  |       { timeout: 10000 }
  61  |     );
  62  |     await page.getByRole('button', { name: /transfer|send|confirm|continue|pay|submit/i }).click();
  63  | 
  64  |     return await responsePromise;
  65  |   });
  66  | 
  67  |   await test.step('API returns an error for the sanctioned recipient', async () => {
  68  |     expect(transferResponse.status()).toBe(400);
  69  |     const body = await transferResponse.json();
  70  |     console.log('Transfer body:', JSON.stringify(body));
  71  |     expect(body.message).toBeTruthy();
  72  | 
  73  |     // DEFECT: the error should say it was a compliance/sanction block
  74  |     expect.soft(JSON.stringify(body), 'API error should mention the compliance/sanction reason')
  75  |       .toMatch(/sanction|compliance|blocked/i);
  76  |   });
  77  | 
  78  |   // Step 2: web UI displays a user-friendly error message
  79  |   await test.step('UI shows a user-friendly error', async () => {
  80  |     const error = page.getByRole('alert')
  81  |       .or(page.getByText(/not valid|blocked|compliance|unable|failed|declined/i))
  82  |       .first();
  83  |     await expect(error).toBeVisible();
  84  |     console.log('UI error text:', await error.innerText());
  85  |     await expect(error).not.toContainText(/500|stack|exception|undefined/i);
  86  |     await expect(page.getByText(/transfer successful/i)).toHaveCount(0);
  87  |   });
  88  | 
  89  |   // Step 3: transaction NOT created in DB, no orphaned records
  90  |   await test.step('No transaction created in the DB', async () => {
  91  |     const [{ newTxns }] = await runQuery(
  92  |       `SELECT COUNT(*) AS newTxns FROM transactions WHERE id > @txnIdBefore`, { txnIdBefore });
  93  |     expect(newTxns, 'no new transaction rows').toBe(0);
  94  | 
  95  |     const [{ balance }] = await runQuery(
  96  |       `SELECT balance FROM accounts WHERE id = @id`, { id: aliceId });
  97  |     expect(balance, 'Alice balance unchanged').toBe(balanceBefore);
  98  | 
  99  |     const [{ newLedger }] = await runQuery(
  100 |       `SELECT COUNT(*) AS newLedger FROM ledger_entries WHERE id > @ledgerIdBefore`, { ledgerIdBefore });
  101 |     expect(newLedger, 'no new ledger entries').toBe(0);
  102 | 
  103 |     const [{ orphans }] = await runQuery(
  104 |       `SELECT COUNT(*) AS orphans FROM ledger_entries le
  105 |        LEFT JOIN transactions t ON t.id = le.transaction_id
  106 |        WHERE t.id IS NULL AND le.id > @ledgerIdBefore`, { ledgerIdBefore });
  107 |     expect(orphans, 'no orphaned ledger entries').toBe(0);
  108 |   });
  109 | 
  110 |   // Step 4: audit log records the attempt and the failure reason
  111 |   await test.step('Audit log records attempt and failure reason', async () => {
  112 |     // everything written to the audit log for Alice since the test started
  113 |     const getRows = () => runQuery(
  114 |       `SELECT id, action, metadata FROM audit_log
  115 |        WHERE account_id = @id AND id > @auditIdBefore ORDER BY id`, { id: aliceId, auditIdBefore });
  116 | 
  117 |     // give a slow audit write up to 5 seconds, ignoring the login entry from this test
  118 |     let rows = await getRows();
  119 |     for (let i = 0; i < 10 && !rows.some(r => r.action !== 'login'); i++) {
  120 |       await page.waitForTimeout(500);
  121 |       rows = await getRows();
  122 |     }
  123 |     console.log('Audit entries written during this test:');
  124 |     console.table(rows);
  125 | 
  126 |     // DEFECT: the app writes no audit entry for the failed transfer attempt
  127 |     const attempt = rows.filter(r => r.action !== 'login');
  128 |     expect.soft(attempt.length, 'Audit log should have an entry for the failed transfer attempt')
> 129 |       .toBeGreaterThan(0);
      |        ^ Error: Audit log should have an entry for the failed transfer attempt
  130 | 
  131 |     if (attempt.length > 0) {
  132 |       expect.soft(JSON.stringify(attempt.map(r => r.action))).toMatch(/transfer/i);                           // the attempt
  133 |       expect.soft(JSON.stringify(attempt.map(r => r.metadata))).toMatch(/sanction|compliance|blocked|not valid/i); // the failure reason
  134 |     }
  135 |   });
  136 | });
```