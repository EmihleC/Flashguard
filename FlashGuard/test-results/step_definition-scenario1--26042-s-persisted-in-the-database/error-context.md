# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: step_definition\scenario1.spec.ts >> Flash-Guard - Transfer Integration >> E2E-012: Transfer notification is persisted in the database
- Location: tests\e2e\step_definition\scenario1.spec.ts:718:3

# Error details

```
Error: Expected a dedicated notifications table, but none exists

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
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
> 732 |     ).toBeGreaterThan(0);
      |       ^ Error: Expected a dedicated notifications table, but none exists
  733 |   })
  734 | 
  735 | });
  736 | 
```