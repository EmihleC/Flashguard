# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: step_definition\scenario1.spec.ts >> Flash-Guard - Transfer Integration >> E2E-010: Transfer requires OTP verification before authorisation
- Location: tests\e2e\step_definition\scenario1.spec.ts:701:3

# Error details

```
Error: Expected an OTP verification field before transfer authorisation

expect(locator).toBeVisible() failed

Locator: getByLabel(/OTP|one.time password|verification code/i)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expected an OTP verification field before transfer authorisation getByLabel(/OTP|one.time password|verification code/i) with timeout 10000ms
  - waiting for getByLabel(/OTP|one.time password|verification code/i)

```

```yaml
- navigation:
  - link "PrimeFin SA Money, Airtime & Data":
    - /url: /dashboard
    - heading "PrimeFin SA" [level=1]
    - paragraph: Money, Airtime & Data
  - list:
    - listitem:
      - link "dashboard Dashboard":
        - /url: /dashboard
    - listitem:
      - link "wifi_tethering Airtime & Data":
        - /url: /airtime
    - listitem:
      - link "payments Transfer Funds":
        - /url: /transfers
    - listitem:
      - link "credit_card Payment Methods":
        - /url: /payment-methods
    - listitem:
      - link "receipt_long Transaction History":
        - /url: /history
  - button "Contact Advisor"
  - list:
    - listitem:
      - link "logout Sign Out":
        - /url: /login
- banner:
  - text: search
  - textbox "Search transactions, accounts..."
  - button "notifications"
  - button "help_outline"
  - link "Quick Pay":
    - /url: /transfers
  - text: A
- main:
  - heading "Transfer Funds" [level=2]
  - paragraph: Securely move money between accounts or to external beneficiaries.
  - text: calendar_today November 24, 2026 1
  - heading "From Account" [level=3]
  - radio "Alice Ledger check_circle R 9 990,00 **** 1" [checked]
  - text: Alice Ledger check_circle R 9 990,00 **** 1
  - radio "Bob Wallet R 2 510,00 **** 2"
  - text: Bob Wallet R 2 510,00 **** 2
  - radio "Charlie Frozen R 450,00 **** 3"
  - text: Charlie Frozen R 450,00 **** 3
  - radio "FlashGuard Mobile Services R 0,00 **** 4"
  - text: FlashGuard Mobile Services R 0,00 **** 4
  - radio "Polite Dlamini R 0,00 **** 6"
  - text: Polite Dlamini R 0,00 **** 6 2
  - heading "To Beneficiary" [level=3]
  - text: search
  - textbox "Search saved beneficiaries or enter new account..."
  - text: BO Bob Wallet PrimeFin • **** 2
  - button "Selected"
  - text: CH Charlie Frozen PrimeFin • **** 3
  - button "Select"
  - text: FL FlashGuard Mobile Services PrimeFin • **** 4
  - button "Select"
  - text: PO Polite Dlamini PrimeFin • **** 6
  - button "Select"
  - text: "3"
  - heading "Transfer Details" [level=3]
  - text: Amount ZAR
  - spinbutton "0.00": "10.00"
  - text: "Available: R 9 990,00 My Reference (Optional)"
  - textbox "e.g. Invoice INV-2024-001": Scenario 1 test
  - text: Transfer Date
  - radio "Today (Immediate)" [checked]
  - text: Today (Immediate)
  - radio "calendar_month Schedule"
  - text: calendar_month Schedule receipt_long
  - heading "Review Transaction" [level=3]
  - text: From Alice Ledger **** 1 To Bob Wallet PrimeFin • **** 2 Date Today Est. Fee ZAR 0.00 Total Amount R 10,00
  - button "lock Confirm & Transfer"
  - text: verified Encrypted gavel Regulated
```

# Test source

```ts
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
> 713 |     ).toBeVisible();
      |       ^ Error: Expected an OTP verification field before transfer authorisation
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