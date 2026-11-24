# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: step_definition\scenario1.spec.ts >> Flash-Guard - Transfer Integration >> E2E-009: Selecting a recipient and amount triggers API pre-validation
- Location: tests\e2e\step_definition\scenario1.spec.ts:670:3

# Error details

```
Error: No pre-validation API request was triggered after selecting a recipient and entering an amount

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - navigation [ref=f1e4]:
    - generic [ref=f1e5]:
      - link [ref=f1e7] [cursor=pointer]:
        - /url: /dashboard
        - heading "PrimeFin SA" [level=1] [ref=f1e8]
        - paragraph [ref=f1e9]: Money, Airtime & Data
      - list [ref=f1e10]:
        - listitem [ref=f1e11]:
          - link "dashboard Dashboard" [ref=f1e12] [cursor=pointer]:
            - /url: /dashboard
            - generic [ref=f1e13]: dashboard
            - generic [ref=f1e14]: Dashboard
        - listitem [ref=f1e15]:
          - link "wifi_tethering Airtime & Data" [ref=f1e16] [cursor=pointer]:
            - /url: /airtime
            - generic [ref=f1e17]: wifi_tethering
            - generic [ref=f1e18]: Airtime & Data
        - listitem [ref=f1e19]:
          - link "payments Transfer Funds" [ref=f1e20] [cursor=pointer]:
            - /url: /transfers
            - generic [ref=f1e21]: payments
            - generic [ref=f1e22]: Transfer Funds
        - listitem [ref=f1e23]:
          - link "credit_card Payment Methods" [ref=f1e24] [cursor=pointer]:
            - /url: /payment-methods
            - generic [ref=f1e25]: credit_card
            - generic [ref=f1e26]: Payment Methods
        - listitem [ref=f1e27]:
          - link "receipt_long Transaction History" [ref=f1e28] [cursor=pointer]:
            - /url: /history
            - generic [ref=f1e29]: receipt_long
            - generic [ref=f1e30]: Transaction History
      - generic [ref=f1e31]:
        - button "Contact Advisor" [ref=f1e32] [cursor=pointer]
        - list [ref=f1e33]:
          - listitem [ref=f1e34]:
            - link "logout Sign Out" [ref=f1e35] [cursor=pointer]:
              - /url: /login
              - generic [ref=f1e36]: logout
              - generic [ref=f1e37]: Sign Out
  - banner [ref=f1e38]:
    - generic [ref=f1e40]:
      - generic [ref=f1e41]: search
      - textbox "Search transactions, accounts..." [ref=f1e42]
    - generic [ref=f1e43]:
      - button "notifications" [ref=f1e44] [cursor=pointer]
      - button "help_outline" [ref=f1e47] [cursor=pointer]
      - link "Quick Pay" [ref=f1e49] [cursor=pointer]:
        - /url: /transfers
      - generic [ref=f1e50] [cursor=pointer]: A
  - main [ref=f1e51]:
    - generic [ref=f1e52]:
      - generic [ref=f1e53]:
        - heading "Transfer Funds" [level=2] [ref=f1e54]
        - paragraph [ref=f1e55]: Securely move money between accounts or to external beneficiaries.
      - generic [ref=f1e56]:
        - generic [ref=f1e57]: calendar_today
        - text: November 24, 2026
    - generic [ref=f1e59]:
      - generic [ref=f1e60]:
        - generic [ref=f1e61]:
          - generic [ref=f1e62]:
            - generic [ref=f1e63]: "1"
            - heading "From Account" [level=3] [ref=f1e64]
          - generic [ref=f1e65]:
            - generic [ref=f1e66] [cursor=pointer]:
              - radio "Alice Ledger check_circle R 9 990,00 **** 1" [checked] [ref=f1e67]
              - generic [ref=f1e68]:
                - generic [ref=f1e69]:
                  - generic [ref=f1e70]: Alice Ledger
                  - generic [ref=f1e71]: check_circle
                - generic [ref=f1e72]: R 9 990,00
                - generic [ref=f1e73]: "**** 1"
            - generic [ref=f1e74] [cursor=pointer]:
              - radio "Bob Wallet R 2 510,00 **** 2" [ref=f1e75]
              - generic [ref=f1e76]:
                - generic [ref=f1e77]: Bob Wallet
                - generic [ref=f1e79]: R 2 510,00
                - generic [ref=f1e80]: "**** 2"
            - generic [ref=f1e81] [cursor=pointer]:
              - radio "Charlie Frozen R 450,00 **** 3" [ref=f1e82]
              - generic [ref=f1e83]:
                - generic [ref=f1e84]: Charlie Frozen
                - generic [ref=f1e86]: R 450,00
                - generic [ref=f1e87]: "**** 3"
            - generic [ref=f1e88] [cursor=pointer]:
              - radio "FlashGuard Mobile Services R 0,00 **** 4" [ref=f1e89]
              - generic [ref=f1e90]:
                - generic [ref=f1e91]: FlashGuard Mobile Services
                - generic [ref=f1e93]: R 0,00
                - generic [ref=f1e94]: "**** 4"
            - generic [ref=f1e95] [cursor=pointer]:
              - radio "Polite Dlamini R 0,00 **** 6" [ref=f1e96]
              - generic [ref=f1e97]:
                - generic [ref=f1e98]: Polite Dlamini
                - generic [ref=f1e100]: R 0,00
                - generic [ref=f1e101]: "**** 6"
        - generic [ref=f1e102]:
          - generic [ref=f1e103]:
            - generic [ref=f1e104]: "2"
            - heading "To Beneficiary" [level=3] [ref=f1e105]
          - generic [ref=f1e106]:
            - generic [ref=f1e107]: search
            - textbox "Search saved beneficiaries or enter new account..." [ref=f1e108]
          - generic [ref=f1e109]:
            - generic [ref=f1e110] [cursor=pointer]:
              - generic [ref=f1e111]:
                - generic [ref=f1e112]: BO
                - generic [ref=f1e113]:
                  - generic [ref=f1e114]: Bob Wallet
                  - generic [ref=f1e115]: PrimeFin • **** 2
              - button "Selected" [ref=f1e116]
            - generic [ref=f1e117] [cursor=pointer]:
              - generic [ref=f1e118]:
                - generic [ref=f1e119]: CH
                - generic [ref=f1e120]:
                  - generic [ref=f1e121]: Charlie Frozen
                  - generic [ref=f1e122]: PrimeFin • **** 3
              - button "Select" [ref=f1e123]
            - generic [ref=f1e124] [cursor=pointer]:
              - generic [ref=f1e125]:
                - generic [ref=f1e126]: FL
                - generic [ref=f1e127]:
                  - generic [ref=f1e128]: FlashGuard Mobile Services
                  - generic [ref=f1e129]: PrimeFin • **** 4
              - button "Select" [ref=f1e130]
            - generic [ref=f1e131] [cursor=pointer]:
              - generic [ref=f1e132]:
                - generic [ref=f1e133]: PO
                - generic [ref=f1e134]:
                  - generic [ref=f1e135]: Polite Dlamini
                  - generic [ref=f1e136]: PrimeFin • **** 6
              - button "Select" [ref=f1e137]
        - generic [ref=f1e138]:
          - generic [ref=f1e139]:
            - generic [ref=f1e140]: "3"
            - heading "Transfer Details" [level=3] [ref=f1e141]
          - generic [ref=f1e142]:
            - generic [ref=f1e143]:
              - generic [ref=f1e144]: Amount
              - generic [ref=f1e145]:
                - generic [ref=f1e146]: ZAR
                - spinbutton "0.00" [active] [ref=f1e147]: "10.00"
              - generic [ref=f1e148]: "Available: R 9 990,00"
            - generic [ref=f1e150]:
              - generic [ref=f1e151]: My Reference (Optional)
              - textbox "e.g. Invoice INV-2024-001" [ref=f1e152]
            - generic [ref=f1e153]:
              - generic [ref=f1e154]: Transfer Date
              - generic [ref=f1e155]:
                - generic [ref=f1e156] [cursor=pointer]:
                  - radio "Today (Immediate)" [checked] [ref=f1e157]
                  - generic [ref=f1e158]: Today (Immediate)
                - generic [ref=f1e159] [cursor=pointer]:
                  - radio "calendar_month Schedule" [ref=f1e160]
                  - generic [ref=f1e161]:
                    - generic [ref=f1e162]: calendar_month
                    - text: Schedule
      - generic [ref=f1e163]:
        - generic [ref=f1e164]:
          - generic [ref=f1e165]:
            - generic [ref=f1e166]: receipt_long
            - heading "Review Transaction" [level=3] [ref=f1e167]
          - generic [ref=f1e168]:
            - generic [ref=f1e169]:
              - generic [ref=f1e170]: From
              - generic [ref=f1e171]:
                - generic [ref=f1e172]: Alice Ledger
                - generic [ref=f1e173]: "**** 1"
            - generic [ref=f1e174]:
              - generic [ref=f1e175]: To
              - generic [ref=f1e176]:
                - generic [ref=f1e177]: Bob Wallet
                - generic [ref=f1e178]: PrimeFin • **** 2
            - generic [ref=f1e179]:
              - generic [ref=f1e180]: Date
              - generic [ref=f1e181]: Today
            - generic [ref=f1e182]:
              - generic [ref=f1e183]: Est. Fee
              - generic [ref=f1e184]: ZAR 0.00
          - generic [ref=f1e185]:
            - generic [ref=f1e186]: Total Amount
            - generic [ref=f1e187]: R 10,00
          - button "lock Confirm & Transfer" [ref=f1e189] [cursor=pointer]:
            - generic [ref=f1e190]: lock
            - text: Confirm & Transfer
        - generic [ref=f1e191]:
          - generic [ref=f1e192]:
            - generic [ref=f1e193]: verified
            - text: Encrypted
          - generic [ref=f1e194]:
            - generic [ref=f1e195]: gavel
            - text: Regulated
```

# Test source

```ts
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
  665 |     ).toBeGreaterThan(0);
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
> 696 |     ).toBe(true);
      |       ^ Error: No pre-validation API request was triggered after selecting a recipient and entering an amount
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