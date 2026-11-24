import { test, expect } from '@playwright/test';
import { executeSql, getLatestLoginAuditId } from '../helpers/database';
import { loginAsAlice, prepareTransfer } from '../helpers/scenario1-actions';
import {
  ACCOUNT_ID,
  API_URL,
  BASE_URL,
  EMAIL,
  PASSWORD
} from '../helpers/scenario1-data';

test.describe('Flash-Guard - Transfer Integration', () => {

    test('E2E-001: User successfully logs in through the web application', async ({ page }) => {
    
        // Open the Vite web application using the configured baseURL
        await loginAsAlice(page);
    
        // Verify successful authentication
        await expect(page).toHaveURL(/dashboard/);
    
        await expect(
          page.getByText('Welcome back, Alice Ledger!')
        ).toBeVisible();
    
        // Verify the browser stored the authenticated session
        const session = await page.evaluate(() =>
          localStorage.getItem('flashguard-session')
        );
    
        expect(session).not.toBeNull();
    
        const parsedSession = JSON.parse(session!);
    
        expect(parsedSession.token).toBeTruthy();
        expect(parsedSession.user.email).toBe(EMAIL);
      });
    
    
      test('E2E-002: Successful API login creates a new database audit record', async ({ request }) => {
    
        // Capture the latest login audit ID before the API request
        const previousAuditId = getLatestLoginAuditId(ACCOUNT_ID);
    
        // Authenticate through the actual API
        const response = await request.post(`${API_URL}/auth/login`, {
          data: {
            email: EMAIL,
            password: PASSWORD
          }
        });
    
        expect(response.status()).toBe(200);
    
        const responseBody = await response.json();
    
        expect(responseBody.token).toBeTruthy();
        expect(responseBody.user.email).toBe(EMAIL);
        expect(responseBody.user.id).toBe(ACCOUNT_ID);
    
        // Verify that a new database audit record was created
        const latestAuditId = getLatestLoginAuditId(ACCOUNT_ID);
    
        expect(latestAuditId).toBeGreaterThan(previousAuditId);
      });

  // E2E-003: Verify a successful transfer through the web application
  test('E2E-003: User successfully submits a funds transfer through the web application', async ({ page }) => {
         // E2E-011: Monitor notification-related network activity
         const notificationRequests: {
         url: string;
         method: string;
         }[] = [];

        page.on('request', request => {
          if (/notification|sms|push|twilio|message/i.test(request.url())) {
           notificationRequests.push({
           url: request.url(),
           method: request.method()
    });
  }
});
    // Step 1: Log in as Alice
    await loginAsAlice(page);

    // Step 2: Open the Transfer Funds page
    await page.goto(`${BASE_URL}/transfers`);

    // Step 3: Verify Alice is automatically selected as the sender
    await expect(
      page.getByText('Alice Ledger', { exact: true }).first()
    ).toBeVisible();

    const senderRadio = page.locator('input[name="from_account"]').first();

    await expect(senderRadio).toBeChecked();

    // Step 4: Select Bob as the recipient
    const beneficiarySection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'To Beneficiary' })
    });
    await beneficiarySection.getByText('Bob Wallet', { exact: true }).click();

    // Step 5: Enter transfer details
    await page.getByPlaceholder('0.00').fill('10.00');

    await page.getByPlaceholder('e.g. Invoice INV-2024-001')
      .fill('E2E-003 Test Transfer');

    // Step 6: Capture the transfer API response
    const transferResponsePromise = page.waitForResponse(response =>
      response.url().includes('/transactions/transfer') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', {
      name: 'Confirm & Transfer'
    }).click();

    const transferResponse = await transferResponsePromise;

    // Step 7: Verify successful API response
    expect(transferResponse.status()).toBe(201);

    const transfer = await transferResponse.json();

    expect(transfer.id).toBeTruthy();
    expect(transfer.sender_account_id).toBe(1);
    expect(transfer.recipient_account_id).toBe(2);
    expect(Number(transfer.amount)).toBe(10);
    expect(transfer.status).toBe('pending');

    // Step 8: Verify success notification
    await expect(
      page.getByText(
        new RegExp(`Transfer #${transfer.id} created successfully!`)
      )
    ).toBeVisible();

    // Attach E2E-011 notification network evidence
    await test.info().attach('E2E-011-notification-network-observation', {
       body: JSON.stringify(notificationRequests, null, 2),
       contentType: 'application/json'
    });

    console.log( 'E2E-011 notification-related requests:', notificationRequests);

  });


  // E2E-004: Verify transfer persistence in SQL Server
  test('E2E-004: Successful transfer is correctly persisted in the database', async ({ page }) => {

    // Step 1: Log in as Alice
    await loginAsAlice(page);

    // Step 2: Open the Transfer Funds page
    await page.goto(`${BASE_URL}/transfers`);

    // Step 3: Verify Alice is selected as the sender
    await expect(
      page.getByText('Alice Ledger', { exact: true }).first()
    ).toBeVisible();

    const senderRadio = page.locator('input[name="from_account"]').first();

    await expect(senderRadio).toBeChecked();

    // Step 4: Select Bob as the recipient
    const beneficiarySection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'To Beneficiary' })
    });
    await beneficiarySection.getByText('Bob Wallet', { exact: true }).click();

    // Step 5: Enter a fresh transfer
    await page.getByPlaceholder('0.00').fill('10.00');

    await page.getByPlaceholder('e.g. Invoice INV-2024-001')
      .fill('E2E-004 Database Persistence Test');

    // Step 6: Capture the transaction created by the API
    const transferResponsePromise = page.waitForResponse(response =>
      response.url().includes('/transactions/transfer') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', {
      name: 'Confirm & Transfer'
    }).click();

    const transferResponse = await transferResponsePromise;

    // Step 7: Verify that the API created the transaction
    expect(transferResponse.status()).toBe(201);

    const transfer = await transferResponse.json();

    const transactionId = Number(transfer.id);

    expect(Number.isInteger(transactionId)).toBe(true);
    expect(transactionId).toBeGreaterThan(0);

    // Step 8: Query SQL Server using the generated transaction ID
    const databaseResult = executeSql(`
      SET NOCOUNT ON;

      SELECT
        sender_account_id,
        recipient_account_id,
        amount,
        status,
        transaction_type
      FROM dbo.transactions
      WHERE id = ${transactionId};
    `);

    // Step 9: Confirm that the transaction exists in the database
    expect(
      databaseResult,
      `Transaction ${transactionId} was not found in the database`
    ).not.toBe('');

    const databaseRecord = databaseResult.split('|');

    expect(databaseRecord).toHaveLength(5);

    // Step 10: Verify the persisted transaction details
    expect(Number(databaseRecord[0])).toBe(1);
    expect(Number(databaseRecord[1])).toBe(2);
    expect(Number(databaseRecord[2])).toBe(10);
    expect(databaseRecord[3]).toBe('pending');
    expect(databaseRecord[4]).toBe('transfer');

    // Step 11: Verify the success notification
    await expect(
      page.getByText(
        new RegExp(`Transfer #${transactionId} created successfully!`)
      )
    ).toBeVisible();

  });



  // E2E-005: Verify transfer audit logging in SQL Server
  test('E2E-005: Successful transfer creates the correct audit log entry', async ({ page }) => {

    // Step 1: Log in as Alice
    await loginAsAlice(page);

    // Step 2: Open the Transfer Funds page
    await page.goto(`${BASE_URL}/transfers`);

    // Step 3: Verify Alice is selected as the sender
    await expect(
      page.getByText('Alice Ledger', { exact: true }).first()
    ).toBeVisible();

    const senderRadio = page.locator('input[name="from_account"]').first();

    await expect(senderRadio).toBeChecked();

    // Step 4: Select Bob as the recipient
    const beneficiarySection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'To Beneficiary' })
    });

    await beneficiarySection.getByText('Bob Wallet', { exact: true }).click();

    // Step 5: Enter transfer details
    await page.getByPlaceholder('0.00').fill('10.00');

    await page.getByPlaceholder('e.g. Invoice INV-2024-001')
      .fill('E2E-005 Audit Logging Test');

    // Step 6: Capture the API response
    const transferResponsePromise = page.waitForResponse(response =>
      response.url().includes('/transactions/transfer') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', {
      name: 'Confirm & Transfer'
    }).click();

    const transferResponse = await transferResponsePromise;

    // Step 7: Verify successful transfer creation
    expect(transferResponse.status()).toBe(201);

    const transfer = await transferResponse.json();

    const transactionId = Number(transfer.id);

    expect(Number.isInteger(transactionId)).toBe(true);
    expect(transactionId).toBeGreaterThan(0);

    expect(transfer.sender_account_id).toBe(1);
    expect(transfer.recipient_account_id).toBe(2);
    expect(Number(transfer.amount)).toBe(10);
    expect(transfer.status).toBe('pending');

    // Verify the transient toast before the slower database assertion.
    await expect(
      page.getByText(
        new RegExp(`Transfer #${transactionId} created successfully!`)
      )
    ).toBeVisible();

    // Step 8: Query the audit log using the exact transaction ID
    const auditResult = executeSql(`
      SET NOCOUNT ON;

      SELECT
        account_id,
        action,
        JSON_VALUE(metadata, '$.transaction_id'),
        JSON_VALUE(metadata, '$.amount'),
        JSON_VALUE(metadata, '$.status')
      FROM dbo.audit_log
      WHERE account_id = 1
        AND action = 'transfer_initiated'
        AND JSON_VALUE(metadata, '$.transaction_id') = '${transactionId}';
    `);

    // Step 9: Verify that an audit record exists
    expect(
      auditResult,
      `No audit record found for transaction ${transactionId}`
    ).not.toBe('');

    const auditRecord = auditResult.split('|');

    expect(auditRecord).toHaveLength(5);

    // Step 10: Verify the audit record details
    expect(Number(auditRecord[0])).toBe(1);
    expect(auditRecord[1]).toBe('transfer_initiated');
    expect(Number(auditRecord[2])).toBe(transactionId);
    expect(Number(auditRecord[3])).toBe(10);
    expect(auditRecord[4]).toBe('pending');

  });

  // E2E-006: Verify insufficient funds validation
  test('E2E-006: Transfer is rejected when sender has insufficient funds', async ({ page }) => {

    const attemptedAmount = 9991;

    // Step 1: Capture database counts before the attempted transfer
    const beforeResult = executeSql(`
      SET NOCOUNT ON;

      SELECT
        (SELECT COUNT(*)
         FROM dbo.transactions
         WHERE sender_account_id = 1
           AND recipient_account_id = 2) AS transaction_count,

        (SELECT COUNT(*)
         FROM dbo.audit_log
         WHERE account_id = 1
           AND action = 'transfer_initiated') AS audit_count;
    `);

    const beforeCounts = beforeResult.split('|');

    expect(beforeCounts).toHaveLength(2);

    const transactionsBefore = Number(beforeCounts[0]);
    const auditsBefore = Number(beforeCounts[1]);

    // Step 2: Log in as Alice
    await loginAsAlice(page);

    // Step 3: Open the Transfer Funds page
    await page.goto(`${BASE_URL}/transfers`);

    // Step 4: Verify Alice is selected as sender
    await expect(
      page.getByText('Alice Ledger', { exact: true }).first()
    ).toBeVisible();

    const senderRadio = page.locator('input[name="from_account"]').first();

    await expect(senderRadio).toBeChecked();

    // Step 5: Select Bob as recipient
    const beneficiarySection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'To Beneficiary' })
    });

    await beneficiarySection.getByText('Bob Wallet', { exact: true }).click();

    // Step 6: Enter an amount greater than Alice's balance
    await page.getByPlaceholder('0.00').fill(String(attemptedAmount));

    await page.getByPlaceholder('e.g. Invoice INV-2024-001')
      .fill('E2E-006 Insufficient Funds Test');

    // Step 7: Capture the API response
    const transferResponsePromise = page.waitForResponse(response =>
      response.url().includes('/transactions/transfer') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', {
      name: 'Confirm & Transfer'
    }).click();

    const transferResponse = await transferResponsePromise;

    // Step 8: Verify the API rejects the transfer
    expect(transferResponse.status()).toBe(400);

    const errorResponse = await transferResponse.json();

    expect(errorResponse.message).toBe('Insufficient funds');

    // Step 9: Verify the UI displays the error notification
    await expect(
      page.getByText('Insufficient funds', { exact: true })
    ).toBeVisible();

    // Step 10: Verify no transaction was created
    const afterResult = executeSql(`
      SET NOCOUNT ON;

      SELECT
        (SELECT COUNT(*)
         FROM dbo.transactions
         WHERE sender_account_id = 1
           AND recipient_account_id = 2) AS transaction_count,

        (SELECT COUNT(*)
         FROM dbo.audit_log
         WHERE account_id = 1
           AND action = 'transfer_initiated') AS audit_count;
    `);

    const afterCounts = afterResult.split('|');

    expect(afterCounts).toHaveLength(2);

    const transactionsAfter = Number(afterCounts[0]);
    const auditsAfter = Number(afterCounts[1]);

    // Step 11: Verify database records were not added
    expect(transactionsAfter).toBe(transactionsBefore);
    expect(auditsAfter).toBe(auditsBefore);

  });


  // E2E-007: Verify AML transaction rejection
  test('E2E-007: High-value transfer is flagged and rejected by AML rules', async ({ page }) => {

    // Step 1: Retrieve Alice's original balance
    const originalBalanceResult = executeSql(`
      SET NOCOUNT ON;

      SELECT CONVERT(varchar(30), balance)
      FROM dbo.accounts
      WHERE id = 1;
    `);

    const originalBalance = Number(originalBalanceResult);

    expect(Number.isFinite(originalBalance)).toBe(true);
    expect(originalBalance).toBeGreaterThan(0);

    try {

      // Step 2: Temporarily increase Alice's balance
      executeSql(`
        UPDATE dbo.accounts
        SET balance = 20000.00
        WHERE id = 1;
      `);

      // Step 3: Log in as Alice
      await loginAsAlice(page);

      // Step 4: Open the Transfer Funds page
      await page.goto(`${BASE_URL}/transfers`);

      // Step 5: Verify Alice is selected as sender
      await expect(
        page.getByText('Alice Ledger', { exact: true }).first()
      ).toBeVisible();

      const senderRadio = page.locator('input[name="from_account"]').first();

      await expect(senderRadio).toBeChecked();

      // Step 6: Select Bob as recipient
      const beneficiarySection = page.locator('section').filter({
        has: page.getByRole('heading', { name: 'To Beneficiary' })
      });

      await beneficiarySection.getByText('Bob Wallet', { exact: true }).click();

      // Step 7: Enter an amount above the AML threshold
      await page.getByPlaceholder('0.00').fill('10001');

      await page.getByPlaceholder('e.g. Invoice INV-2024-001')
        .fill('E2E-007 AML Compliance Test');

      // Step 8: Capture the transfer API response
      const transferResponsePromise = page.waitForResponse(response =>
        response.url().includes('/transactions/transfer') &&
        response.request().method() === 'POST'
      );

      await page.getByRole('button', {
        name: 'Confirm & Transfer'
      }).click();

      const transferResponse = await transferResponsePromise;

      // Step 9: Verify the API creates the AML-rejected transaction
      expect(transferResponse.status()).toBe(201);

      const transfer = await transferResponse.json();

      const transactionId = Number(transfer.id);

      expect(Number.isInteger(transactionId)).toBe(true);
      expect(transactionId).toBeGreaterThan(0);

      expect(transfer.sender_account_id).toBe(1);
      expect(transfer.recipient_account_id).toBe(2);
      expect(Number(transfer.amount)).toBe(10001);
      expect(transfer.status).toBe('rejected');
      expect(transfer.compliance_flag).toBe('aml');

      // Step 10: Verify the AML transaction in SQL Server
      const transactionResult = executeSql(`
        SET NOCOUNT ON;

        SELECT
          sender_account_id,
          recipient_account_id,
          amount,
          status,
          transaction_type,
          compliance_flag
        FROM dbo.transactions
        WHERE id = ${transactionId};
      `);

      expect(
        transactionResult,
        `AML transaction ${transactionId} was not found`
      ).not.toBe('');

      const transactionRecord = transactionResult.split('|');

      expect(transactionRecord).toHaveLength(6);

      expect(Number(transactionRecord[0])).toBe(1);
      expect(Number(transactionRecord[1])).toBe(2);
      expect(Number(transactionRecord[2])).toBe(10001);
      expect(transactionRecord[3]).toBe('rejected');
      expect(transactionRecord[4]).toBe('transfer');
      expect(transactionRecord[5]).toBe('aml');

      // Step 11: Verify the corresponding audit record
      const auditResult = executeSql(`
        SET NOCOUNT ON;

        SELECT
          account_id,
          action,
          JSON_VALUE(metadata, '$.transaction_id'),
          JSON_VALUE(metadata, '$.amount'),
          JSON_VALUE(metadata, '$.status')
        FROM dbo.audit_log
        WHERE account_id = 1
          AND action = 'transfer_initiated'
          AND JSON_VALUE(metadata, '$.transaction_id') = '${transactionId}';
      `);

      expect(
        auditResult,
        `Audit record for AML transaction ${transactionId} was not found`
      ).not.toBe('');

      const auditRecord = auditResult.split('|');

      expect(auditRecord).toHaveLength(5);

      expect(Number(auditRecord[0])).toBe(1);
      expect(auditRecord[1]).toBe('transfer_initiated');
      expect(Number(auditRecord[2])).toBe(transactionId);
      expect(Number(auditRecord[3])).toBe(10001);
      expect(auditRecord[4]).toBe('rejected');

      // Step 12: Verify the application notification
      await expect(
        page.getByText(
          new RegExp(`Transfer #${transactionId} created successfully!`)
        )
      ).toBeVisible();

    } finally {

      // Step 13: Always restore Alice's original balance
      executeSql(`
        UPDATE dbo.accounts
        SET balance = ${originalBalance.toFixed(2)}
        WHERE id = 1;
      `);

    }

    // Step 14: Verify that Alice's original balance was restored
    const restoredBalance = Number(executeSql(`
      SET NOCOUNT ON;

      SELECT CONVERT(varchar(30), balance)
      FROM dbo.accounts
      WHERE id = 1;
    `));

    expect(restoredBalance).toBe(originalBalance);

  });

  // E2E-008: Verify login and database session creation
  test('E2E-008: Login creates an authenticated database session', async ({ page }) => {

    const loginResponsePromise = page.waitForResponse(response =>
      response.url().includes('/auth/login') &&
      response.request().method() === 'POST'
    );

    await loginAsAlice(page);

    const loginResponse = await loginResponsePromise;

    expect(loginResponse.status()).toBe(200);

    // Verify that the login was recorded in the audit log
    const auditId = getLatestLoginAuditId(1);

    expect(
      auditId,
      'Login was not recorded in the database audit log'
    ).toBeGreaterThan(0);

    // Check whether a database sessions table exists
    const sessionTableCount = Number(executeSql(`
      SET NOCOUNT ON;

      SELECT COUNT(*)
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo'
      AND TABLE_NAME = 'sessions';
    `));

    expect(
      sessionTableCount,
      'Expected a database sessions table, but none exists'
    ).toBeGreaterThan(0);
  });


  // E2E-009: Verify transfer pre-validation
  test('E2E-009: Selecting a recipient and amount triggers API pre-validation', async ({ page }) => {

    await loginAsAlice(page);
    await page.goto(`${BASE_URL}/transfers`);

    const validationRequestPromise = page.waitForRequest(request =>
      request.url().includes('/compliance-checks/validate') &&
      request.method() === 'POST'
    , { timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    const beneficiarySection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'To Beneficiary' })
    });

    await beneficiarySection.getByText('Bob Wallet', { exact: true }).click();

    await page.getByPlaceholder('0.00').fill('10.00');

    // Do not confirm the transfer; this test must not create a transaction.
    const validationRequestObserved = await validationRequestPromise;

    expect(
      validationRequestObserved,
      'No pre-validation API request was triggered after selecting a recipient and entering an amount'
    ).toBe(true);
  });


  // E2E-010: Verify OTP requirement
  test('E2E-010: Transfer requires OTP verification before authorisation', async ({ page }) => {

    await prepareTransfer(page);

    // Look for an OTP or verification-code input.
    const otpField = page.getByLabel(
      /OTP|one.time password|verification code/i
    );

    await expect(
      otpField,
      'Expected an OTP verification field before transfer authorisation'
    ).toBeVisible();
  });


  // E2E-012: Verify notification persistence
  test('E2E-012: Transfer notification is persisted in the database', async () => {

    const notificationTableCount = Number(executeSql(`
      SET NOCOUNT ON;

      SELECT COUNT(*)
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo'
      AND TABLE_NAME = 'notifications';
    `));

    expect(
      notificationTableCount,
      'Expected a dedicated notifications table, but none exists'
    ).toBeGreaterThan(0);
  })

});
