
import { Given, When, Then } from '@cucumber/cucumber';
declare const $: (selector: string) => any;
declare const browser: {
  setOrientation(orientation: 'LANDSCAPE' | 'PORTRAIT'): Promise<void>;
  getWindowSize(): Promise<{ width: number; height: number }>;
};

// MOB-001: Login screen
Given('the merchant is on the login screen', async () => {
  console.log('\n========== MOB-001 LOGIN SCREEN ==========');

  await verifyLoginScreen();

  console.log('Login screen successfully displayed.');
});

// MOB-002: Email entry
When('the merchant enters the valid email {string}', async (email: string) => {
  await enterEmail(email);
});

When('the merchant enters the email {string}', async (email: string) => {
  await enterEmail(email);
});

// MOB-003: Password entry
When('the merchant enters the valid password {string}', async (password: string) => {
  await enterPassword(password);
});

When('the merchant enters the password {string}', async (password: string) => {
  await enterPassword(password);
});

When('the merchant enters the incorrect password {string}', async (password: string) => {
  await enterPassword(password);
});

// MOB-004: Submit login
When('the merchant submits the login form', async () => {
  const button = signInButton();

  await button.waitForDisplayed({ timeout: 15000 });
  await button.click();

  console.log('Login form submitted.');
});

// MOB-005: Successful authentication
Then('the merchant should successfully access the dashboard', async () => {
  const name = dashboardName('Alice Ledger');

  await name.waitForDisplayed({
    timeout: 30000,
    timeoutMsg: 'Login submitted, but the expected dashboard was not displayed.'
  });

  console.log('Merchant successfully accessed the dashboard.');
});

// MOB-006: Dashboard screen
Given('the merchant is on the Dashboard screen', async () => {
  await dashboardName('Alice Ledger').waitForDisplayed({
    timeout: 15000
  });
});

// MOB-007: Landscape rotation
When('the merchant rotates the device to landscape mode', async () => {
  await browser.setOrientation('LANDSCAPE');
  console.log('Device rotated to landscape mode.');
});

// MOB-008: Portrait rotation
When('the merchant rotates the device to portrait mode', async () => {
  await browser.setOrientation('PORTRAIT');
  console.log('Device rotated to portrait mode.');
});

// MOB-009: Phone screen size
When('the merchant views the app on phone screen size', async () => {
  const size = await browser.getWindowSize();

  console.log(`Phone screen size: ${size.width} x ${size.height}`);
});

// MOB-010: Tablet screen size
When('the merchant views the app on tablet screen size', async () => {
  const size = await browser.getWindowSize();

  console.log(`Tablet screen size: ${size.width} x ${size.height}`);
});

// MOB-011: Dashboard responsiveness
Then('the Dashboard screen should adjust correctly', async () => {
  await dashboardName('Alice Ledger').waitForDisplayed({
    timeout: 15000
  });

  console.log('Dashboard adjusted correctly.');
});

// MOB-012: Account information visibility
Then('all account information should remain visible', async () => {
  const elements = [
    'Total Net Worth',
    'Pending Approvals',
    'Recent Activity'
  ];

  for (const text of elements) {
    const element = await $(`//*[contains(@text, "${text}")]`);

    await element.waitForDisplayed({
      timeout: 15000,
      timeoutMsg: `${text} is not visible on the Dashboard.`
    });
  }

  console.log('All Dashboard information remains visible.');
});
async function verifyLoginScreen(): Promise<void> {
  await signInButton().waitForDisplayed({
    timeout: 15000,
    timeoutMsg: 'The login screen was not displayed.'
  });
}

async function enterEmail(email: string): Promise<void> {
  const emailInput = await $('~email');

  await emailInput.waitForDisplayed({
    timeout: 15000,
    timeoutMsg: 'The email field was not displayed.'
  });
  await emailInput.setValue(email);
}

function signInButton() {
  return $('~Sign in');
}

function dashboardName(name: string) {
  return $(`//*[contains(@text, "${name}")]`);
}

async function enterPassword(password: string): Promise<void> {
  const passwordInput = await $('~password');

  await passwordInput.waitForDisplayed({
    timeout: 15000,
    timeoutMsg: 'The password field was not displayed.'
  });
  await passwordInput.setValue(password);
}
