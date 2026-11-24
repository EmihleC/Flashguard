// WebdriverIO provides these globals when the test runner starts.
declare const $: (selector: string) => any;
declare const browser: any;
declare const driver: any;

/** Mobile "Transact" screen actions needed by the concurrent-transfer E2E. Text-based locators (no testIDs in App.js). */

const esc = (v: string) => v.replace(/"/g, '\\"');
const byText = (v: string) => `android=new UiSelector().text("${esc(v)}")`;
const amountInputSelector = 'new UiSelector().resourceId("transfer-amount")';
const amountInputLocator = `android=${amountInputSelector}`;
const reviewButtonSelector = 'new UiSelector().resourceId("transfer-submit")';

export interface MobileTransferResult { ok: boolean; title: string; message: string }

class TransferPage {
  /** Scrolls the Transact ScrollView until the given UiSelector is on screen and returns that element. */
  private async scrollTo(uiSelector: string) {
    const el = await $(
      `android=new UiScrollable(new UiSelector().scrollable(true)).setMaxSearchSwipes(10).scrollIntoView(${uiSelector})`,
    );
    await el.waitForDisplayed({ timeout: 10000 });
    return el;
  }

  /** Use a stable test ID because the amount text changes as the controlled input updates. */
  async setAmount(amount: number) {
    const input = await this.scrollTo(amountInputSelector);
    await input.click();
    await input.clearValue();
    const refreshedInput = $(amountInputLocator);
    await refreshedInput.waitForDisplayed({ timeout: 10000 });
    await refreshedInput.addValue(String(amount));
    await browser.waitUntil(async () => (await $(amountInputLocator).getText()) === String(amount), {
      timeout: 5000,
      timeoutMsg: `Transfer amount did not update to ${amount}`,
    });
    try {
      await driver.hideKeyboard();
    } catch {
      /* keyboard was not showing */
    }
  }

  /** Brings the submit button into view without tapping it, so the tap can be timed precisely. */
  async reviewButton() {
    return this.scrollTo(reviewButtonSelector);
  }

  async tap(el: { elementId: string }) {
    await driver.execute('mobile: clickGesture', { elementId: el.elementId });
  }

  /** App.js shows an Alert: "Transfer submitted" on success, "Transfer failed" + server message otherwise. */
  async waitForTransferResult(timeout = 20000): Promise<MobileTransferResult> {
    const isUp = async (text: string) => $(byText(text)).isDisplayed();
    await browser.waitUntil(async () => (await isUp('Transfer submitted')) || (await isUp('Transfer failed')), {
      timeout,
      timeoutMsg: 'Neither "Transfer submitted" nor "Transfer failed" appeared on the mobile app',
    });
    const ok = await isUp('Transfer submitted');
    let message = '';
    try {
      message = await $('id=android:id/message').getText();
    } catch {
      /* no message text */
    }
    await $('id=android:id/button1').click();
    return { ok, title: ok ? 'Transfer submitted' : 'Transfer failed', message };
  }

  async restartApp() {
    const appPackage = await driver.getCurrentPackage();
    await driver.terminateApp(appPackage);
    await driver.activateApp(appPackage);
  }
}

export default new TransferPage();