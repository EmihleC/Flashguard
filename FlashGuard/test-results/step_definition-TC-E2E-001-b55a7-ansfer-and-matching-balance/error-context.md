# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: step_definition\TC-E2E-001.scenario1.spec.ts >> Flash-Guard - Transfer Integration >> E2E-005: Mobile history shows the transfer and matching balance
- Location: tests\e2e\step_definition\TC-E2E-001.scenario1.spec.ts:287:3

# Error details

```
Error: element ("android=new UiSelector().textMatches("(?i)^(sign in|log in|login)$")") still not displayed after 30000ms
```

# Test source

```ts
  1   | ﻿import { remote, type Browser } from 'webdriverio';
  2   | 
  3   | export type MobileSessionConfig = {
  4   |   serverUrl: string;
  5   |   deviceName: string;
  6   |   app?: string;
  7   |   appPackage?: string;
  8   |   appActivity?: string;
  9   | };
  10  | 
  11  | export function getMobileSessionConfig(): MobileSessionConfig | null {
  12  |   const app = process.env.APK_PATH;
  13  |   const appPackage = process.env.APP_PACKAGE;
  14  |   const appActivity = process.env.APP_ACTIVITY ?? '.MainActivity';
  15  |   const serverUrl = process.env.APPIUM_SERVER_URL ?? 'http://localhost:4723';
  16  |   const deviceName = process.env.DEVICE_NAME ?? 'Android Emulator';
  17  | 
  18  |   if (!app && !appPackage) {
  19  |     return null;
  20  |   }
  21  | 
  22  |   return {
  23  |     serverUrl,
  24  |     deviceName,
  25  |     app,
  26  |     appPackage,
  27  |     appActivity,
  28  |   };
  29  | }
  30  | 
  31  | export async function createMobileSession(config: MobileSessionConfig): Promise<Browser> {
  32  |   const url = new URL(config.serverUrl);
  33  | 
  34  |   return remote({
  35  |     protocol: url.protocol.replace(':', ''),
  36  |     hostname: url.hostname,
  37  |     port: Number(url.port || (url.protocol === 'https:' ? 443 : 4723)),
  38  |     path: url.pathname || '/',
  39  |     logLevel: 'error',
  40  |     capabilities: {
  41  |       platformName: 'Android',
  42  |       'appium:automationName': 'UiAutomator2',
  43  |       'appium:deviceName': config.deviceName,
  44  |       'appium:autoGrantPermissions': true,
  45  |       'appium:newCommandTimeout': 240,
  46  |       ...(config.appPackage
  47  |         ? {
  48  |             'appium:appPackage': config.appPackage,
  49  |             'appium:appActivity': config.appActivity,
  50  |             'appium:noReset': false,
  51  |           }
  52  |         : { 'appium:app': config.app }),
  53  |     } as WebdriverIO.Capabilities,
  54  |   });
  55  | }
  56  | 
  57  | export async function mobileLogin(browser: Browser, email: string, password: string): Promise<void> {
  58  |   const signInButton = browser.$('android=new UiSelector().textMatches("(?i)^(sign in|log in|login)$")');
> 59  |   await signInButton.waitForDisplayed({ timeout: 30000 });
      |   ^ Error: element ("android=new UiSelector().textMatches("(?i)^(sign in|log in|login)$")") still not displayed after 30000ms
  60  | 
  61  |   const emailInput = browser.$(
  62  |     'android=new UiSelector().textContains("900101").className("android.widget.EditText")'
  63  |   );
  64  |   const emailField = (await emailInput.isExisting())
  65  |     ? emailInput
  66  |     : browser.$('//android.widget.EditText[1]');
  67  |   await emailField.waitForDisplayed({ timeout: 10000 });
  68  |   await emailField.click();
  69  |   await emailField.clearValue();
  70  |   await emailField.setValue(email);
  71  | 
  72  |   const passwordField = browser.$('//android.widget.EditText[@password="true"]');
  73  |   await passwordField.waitForDisplayed({ timeout: 10000 });
  74  |   await passwordField.click();
  75  |   await passwordField.clearValue();
  76  |   await passwordField.setValue(password);
  77  | 
  78  |   await signInButton.click();
  79  |   const dashboardMarker = browser.$('android=new UiSelector().textMatches("(?i)^Quick Actions$")');
  80  |   await dashboardMarker.waitForDisplayed({ timeout: 30000 });
  81  | }
  82  | 
  83  | export async function openMobileHistory(browser: Browser): Promise<void> {
  84  |   const historyTab = browser.$(
  85  |     '(//android.widget.TextView[@text="History"])[last()]/ancestor::android.view.ViewGroup[@clickable="true"][1]'
  86  |   );
  87  |   await historyTab.waitForDisplayed({ timeout: 10000 });
  88  |   await historyTab.click();
  89  | 
  90  |   const historyMarker = browser.$('android=new UiSelector().textMatches("(?i)^Total Spending \\(May\\)$")');
  91  |   await historyMarker.waitForDisplayed({ timeout: 15000 });
  92  | }
  93  | 
  94  | export async function findMobileTransactionRow(browser: Browser, transactionId: number) {
  95  |   const selector = `new UiSelector().text("Transfer #${transactionId}")`;
  96  |   const row = await browser.$(
  97  |     `android=new UiScrollable(new UiSelector().scrollable(true)).setMaxSearchSwipes(20).scrollIntoView(${selector})`
  98  |   );
  99  |   await row.waitForDisplayed({ timeout: 15000 });
  100 |   return row;
  101 | }
  102 | 
  103 | export async function readMobileDashboardBalance(browser: Browser): Promise<string> {
  104 |   const dashboardTab = browser.$(
  105 |     '(//android.widget.TextView[@text="Dashboard"])[last()]/ancestor::android.view.ViewGroup[@clickable="true"][1]'
  106 |   );
  107 |   if (await dashboardTab.isExisting()) {
  108 |     await dashboardTab.click();
  109 |   }
  110 | 
  111 |   const title = browser.$(
  112 |     '//android.widget.TextView[translate(@text,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="total net worth"]'
  113 |   );
  114 |   await title.waitForDisplayed({ timeout: 15000 });
  115 |   const value = browser.$(
  116 |     '//android.widget.TextView[translate(@text,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="total net worth"]/following-sibling::android.widget.TextView[1]'
  117 |   );
  118 |   await value.waitForDisplayed({ timeout: 10000 });
  119 |   return value.getText();
  120 | }
  121 | 
```