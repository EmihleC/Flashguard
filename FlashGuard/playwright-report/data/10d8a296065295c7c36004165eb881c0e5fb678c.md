# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: step_definition\scenario1.spec.ts >> Flash-Guard - Transfer Integration >> E2E-008: Login creates an authenticated database session
- Location: tests\e2e\step_definition\scenario1.spec.ts:631:3

# Error details

```
Error: Expected a database sessions table, but none exists

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - status [ref=e3]:
    - generic [ref=e4]: check_circle
    - generic [ref=e5]: Welcome back, Alice Ledger!
  - generic [ref=e6]:
    - navigation [ref=e7]:
      - generic [ref=e8]:
        - link [ref=e10] [cursor=pointer]:
          - /url: /dashboard
          - heading "PrimeFin SA" [level=1] [ref=e11]
          - paragraph [ref=e12]: Money, Airtime & Data
        - list [ref=e13]:
          - listitem [ref=e14]:
            - link "dashboard Dashboard" [ref=e15] [cursor=pointer]:
              - /url: /dashboard
              - generic [ref=e16]: dashboard
              - generic [ref=e17]: Dashboard
          - listitem [ref=e18]:
            - link "wifi_tethering Airtime & Data" [ref=e19] [cursor=pointer]:
              - /url: /airtime
              - generic [ref=e20]: wifi_tethering
              - generic [ref=e21]: Airtime & Data
          - listitem [ref=e22]:
            - link "payments Transfer Funds" [ref=e23] [cursor=pointer]:
              - /url: /transfers
              - generic [ref=e24]: payments
              - generic [ref=e25]: Transfer Funds
          - listitem [ref=e26]:
            - link "credit_card Payment Methods" [ref=e27] [cursor=pointer]:
              - /url: /payment-methods
              - generic [ref=e28]: credit_card
              - generic [ref=e29]: Payment Methods
          - listitem [ref=e30]:
            - link "receipt_long Transaction History" [ref=e31] [cursor=pointer]:
              - /url: /history
              - generic [ref=e32]: receipt_long
              - generic [ref=e33]: Transaction History
        - generic [ref=e34]:
          - button "Contact Advisor" [ref=e35] [cursor=pointer]
          - list [ref=e36]:
            - listitem [ref=e37]:
              - link "logout Sign Out" [ref=e38] [cursor=pointer]:
                - /url: /login
                - generic [ref=e39]: logout
                - generic [ref=e40]: Sign Out
    - banner [ref=e41]:
      - generic [ref=e43]:
        - generic [ref=e44]: search
        - textbox "Search transactions, accounts..." [ref=e45]
      - generic [ref=e46]:
        - button "notifications" [ref=e47] [cursor=pointer]
        - button "help_outline" [ref=e50] [cursor=pointer]
        - link "Quick Pay" [ref=e52] [cursor=pointer]:
          - /url: /transfers
        - generic [ref=e53] [cursor=pointer]: A
    - main [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e56]:
          - heading "Portfolio Overview" [level=2] [ref=e57]
          - paragraph [ref=e58]: Welcome back, Alice. Here is your summary for today.
        - generic [ref=e59]:
          - generic [ref=e60]: calendar_today
          - text: November 24, 2026
      - generic [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]:
            - generic [ref=e65]:
              - generic [ref=e66]: Total Net Worth
              - generic [ref=e67]: account_balance_wallet
            - heading "R 12 950,00.00" [level=3] [ref=e68]:
              - text: R 12 950,00
              - generic [ref=e69]: ".00"
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: trending_up
              - text: +2.4% this month
            - button "View Analysis" [ref=e73] [cursor=pointer]
        - generic [ref=e74]:
          - generic [ref=e75] [cursor=pointer]:
            - generic [ref=e77]:
              - generic [ref=e78]: credit_card
              - generic [ref=e80]:
                - heading "Alice Ledger" [level=4] [ref=e81]
                - paragraph [ref=e82]: "**** 7913"
            - paragraph [ref=e84]: R 9 990,00
          - generic [ref=e85] [cursor=pointer]:
            - generic [ref=e87]:
              - generic [ref=e88]: savings
              - generic [ref=e90]:
                - heading "Bob Wallet" [level=4] [ref=e91]
                - paragraph [ref=e92]: "**** 9137"
            - paragraph [ref=e94]: R 2 510,00
        - generic [ref=e95]:
          - link "phone_iphone Buy Airtime Instant top-up" [ref=e96] [cursor=pointer]:
            - /url: /airtime
            - generic [ref=e97]: phone_iphone
            - generic [ref=e99]:
              - heading "Buy Airtime" [level=4] [ref=e100]
              - paragraph [ref=e101]: Instant top-up
          - link "send_money Send Money Local & Int'l" [ref=e102] [cursor=pointer]:
            - /url: /transfers
            - generic [ref=e103]: send_money
            - generic [ref=e105]:
              - heading "Send Money" [level=4] [ref=e106]
              - paragraph [ref=e107]: Local & Int'l
          - link "receipt_long Pay Bills Manage beneficiaries" [ref=e108] [cursor=pointer]:
            - /url: /transfers
            - generic [ref=e109]: receipt_long
            - generic [ref=e111]:
              - heading "Pay Bills" [level=4] [ref=e112]
              - paragraph [ref=e113]: Manage beneficiaries
        - generic [ref=e114]:
          - generic [ref=e115]:
            - heading "Recent Transactions" [level=3] [ref=e116]
            - link "View All" [ref=e117] [cursor=pointer]:
              - /url: /history
          - generic [ref=e118]:
            - generic [ref=e119]:
              - generic [ref=e120]:
                - generic [ref=e121]: shopping_cart
                - generic [ref=e123]:
                  - paragraph [ref=e124]: "Transfer #30"
                  - paragraph [ref=e125]: 11/24/2026 • rejected
              - paragraph [ref=e126]: "- R 10 001,00"
            - generic [ref=e127]:
              - generic [ref=e128]:
                - generic [ref=e129]: shopping_cart
                - generic [ref=e131]:
                  - paragraph [ref=e132]: "Transfer #29"
                  - paragraph [ref=e133]: 11/24/2026 • pending
              - paragraph [ref=e134]: "- R 10,00"
            - generic [ref=e135]:
              - generic [ref=e136]:
                - generic [ref=e137]: shopping_cart
                - generic [ref=e139]:
                  - paragraph [ref=e140]: "Transfer #28"
                  - paragraph [ref=e141]: 11/24/2026 • pending
              - paragraph [ref=e142]: "- R 10,00"
        - generic [ref=e143]:
          - generic [ref=e144]:
            - generic [ref=e145]:
              - heading "Spending Summary" [level=3] [ref=e146]
              - paragraph [ref=e147]: This Month
            - generic [ref=e148] [cursor=pointer]:
              - generic [ref=e149]: This Month
              - generic [ref=e150]: expand_more
          - generic [ref=e151]:
            - generic [ref=e152]:
              - generic [ref=e153]: 40k
              - generic [ref=e154]: 20k
              - generic [ref=e155]: "0"
            - generic [ref=e156]:
              - generic [ref=e157]: R12k
              - generic [ref=e159]: R20k
              - generic [ref=e161]: R34k
              - generic [ref=e163]: R16k
          - generic [ref=e165]:
            - generic [ref=e166]: Wk 1
            - generic [ref=e167]: Wk 2
            - generic [ref=e168]: Wk 3
            - generic [ref=e169]: Wk 4
```

# Test source

```ts
  565 |       expect(transactionRecord[4]).toBe('transfer');
  566 |       expect(transactionRecord[5]).toBe('aml');
  567 | 
  568 |       // Step 11: Verify the corresponding audit record
  569 |       const auditResult = executeSql(`
  570 |         SET NOCOUNT ON;
  571 | 
  572 |         SELECT
  573 |           account_id,
  574 |           action,
  575 |           JSON_VALUE(metadata, '$.transaction_id'),
  576 |           JSON_VALUE(metadata, '$.amount'),
  577 |           JSON_VALUE(metadata, '$.status')
  578 |         FROM dbo.audit_log
  579 |         WHERE account_id = 1
  580 |           AND action = 'transfer_initiated'
  581 |           AND JSON_VALUE(metadata, '$.transaction_id') = '${transactionId}';
  582 |       `);
  583 | 
  584 |       expect(
  585 |         auditResult,
  586 |         `Audit record for AML transaction ${transactionId} was not found`
  587 |       ).not.toBe('');
  588 | 
  589 |       const auditRecord = auditResult.split('|');
  590 | 
  591 |       expect(auditRecord).toHaveLength(5);
  592 | 
  593 |       expect(Number(auditRecord[0])).toBe(1);
  594 |       expect(auditRecord[1]).toBe('transfer_initiated');
  595 |       expect(Number(auditRecord[2])).toBe(transactionId);
  596 |       expect(Number(auditRecord[3])).toBe(10001);
  597 |       expect(auditRecord[4]).toBe('rejected');
  598 | 
  599 |       // Step 12: Verify the application notification
  600 |       await expect(
  601 |         page.getByText(
  602 |           new RegExp(`Transfer #${transactionId} created successfully!`)
  603 |         )
  604 |       ).toBeVisible();
  605 | 
  606 |     } finally {
  607 | 
  608 |       // Step 13: Always restore Alice's original balance
  609 |       executeSql(`
  610 |         UPDATE dbo.accounts
  611 |         SET balance = ${originalBalance.toFixed(2)}
  612 |         WHERE id = 1;
  613 |       `);
  614 | 
  615 |     }
  616 | 
  617 |     // Step 14: Verify that Alice's original balance was restored
  618 |     const restoredBalance = Number(executeSql(`
  619 |       SET NOCOUNT ON;
  620 | 
  621 |       SELECT CONVERT(varchar(30), balance)
  622 |       FROM dbo.accounts
  623 |       WHERE id = 1;
  624 |     `));
  625 | 
  626 |     expect(restoredBalance).toBe(originalBalance);
  627 | 
  628 |   });
  629 | 
  630 |   // E2E-008: Verify login and database session creation
  631 |   test('E2E-008: Login creates an authenticated database session', async ({ page }) => {
  632 | 
  633 |     const loginResponsePromise = page.waitForResponse(response =>
  634 |       response.url().includes('/auth/login') &&
  635 |       response.request().method() === 'POST'
  636 |     );
  637 | 
  638 |     await loginAsAlice(page);
  639 | 
  640 |     const loginResponse = await loginResponsePromise;
  641 | 
  642 |     expect(loginResponse.status()).toBe(200);
  643 | 
  644 |     // Verify that the login was recorded in the audit log
  645 |     const auditId = getLatestLoginAuditId(1);
  646 | 
  647 |     expect(
  648 |       auditId,
  649 |       'Login was not recorded in the database audit log'
  650 |     ).toBeGreaterThan(0);
  651 | 
  652 |     // Check whether a database sessions table exists
  653 |     const sessionTableCount = Number(executeSql(`
  654 |       SET NOCOUNT ON;
  655 | 
  656 |       SELECT COUNT(*)
  657 |       FROM INFORMATION_SCHEMA.TABLES
  658 |       WHERE TABLE_SCHEMA = 'dbo'
  659 |       AND TABLE_NAME = 'sessions';
  660 |     `));
  661 | 
  662 |     expect(
  663 |       sessionTableCount,
  664 |       'Expected a database sessions table, but none exists'
> 665 |     ).toBeGreaterThan(0);
      |       ^ Error: Expected a database sessions table, but none exists
  666 |   });
  667 | 
  668 | 
  669 |   // E2E-009: Verify transfer pre-validation
  670 |   test('E2E-009: Selecting a recipient and amount triggers API pre-validation', async ({ page }) => {
  671 | 
  672 |     await loginAsAlice(page);
  673 |     await page.goto(`${BASE_URL}/transfers`);
  674 | 
  675 |     const validationRequestPromise = page.waitForRequest(request =>
  676 |       request.url().includes('/compliance-checks/validate') &&
  677 |       request.method() === 'POST'
  678 |     , { timeout: 5000 })
  679 |       .then(() => true)
  680 |       .catch(() => false);
  681 | 
  682 |     const beneficiarySection = page.locator('section').filter({
  683 |       has: page.getByRole('heading', { name: 'To Beneficiary' })
  684 |     });
  685 | 
  686 |     await beneficiarySection.getByText('Bob Wallet', { exact: true }).click();
  687 | 
  688 |     await page.getByPlaceholder('0.00').fill('10.00');
  689 | 
  690 |     // Do not confirm the transfer; this test must not create a transaction.
  691 |     const validationRequestObserved = await validationRequestPromise;
  692 | 
  693 |     expect(
  694 |       validationRequestObserved,
  695 |       'No pre-validation API request was triggered after selecting a recipient and entering an amount'
  696 |     ).toBe(true);
  697 |   });
  698 | 
  699 | 
  700 |   // E2E-010: Verify OTP requirement
  701 |   test('E2E-010: Transfer requires OTP verification before authorisation', async ({ page }) => {
  702 | 
  703 |     await prepareTransfer(page);
  704 | 
  705 |     // Look for an OTP or verification-code input.
  706 |     const otpField = page.getByLabel(
  707 |       /OTP|one.time password|verification code/i
  708 |     );
  709 | 
  710 |     await expect(
  711 |       otpField,
  712 |       'Expected an OTP verification field before transfer authorisation'
  713 |     ).toBeVisible();
  714 |   });
  715 | 
  716 | 
  717 |   // E2E-012: Verify notification persistence
  718 |   test('E2E-012: Transfer notification is persisted in the database', async () => {
  719 | 
  720 |     const notificationTableCount = Number(executeSql(`
  721 |       SET NOCOUNT ON;
  722 | 
  723 |       SELECT COUNT(*)
  724 |       FROM INFORMATION_SCHEMA.TABLES
  725 |       WHERE TABLE_SCHEMA = 'dbo'
  726 |       AND TABLE_NAME = 'notifications';
  727 |     `));
  728 | 
  729 |     expect(
  730 |       notificationTableCount,
  731 |       'Expected a dedicated notifications table, but none exists'
  732 |     ).toBeGreaterThan(0);
  733 |   })
  734 | 
  735 | });
  736 | 
```