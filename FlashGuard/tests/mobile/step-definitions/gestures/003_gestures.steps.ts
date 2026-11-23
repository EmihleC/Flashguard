import { When, Then } from '@wdio/cucumber-framework';
import { DashboardScreen } from '../../../../src/pages/mobile/DashboardScreen';
import { MobileActions } from '../../../../src/support/MobileActions';

const dashboard = new DashboardScreen();
let cardXBefore = 0;

// One tap on a bottom navigation tab using its accessibility description.
async function tapTabOnce(name: string) {
  const tab = await $(
    `android=new UiSelector().descriptionMatches(".*, ${name}").clickable(true)`
  );

  await tab.waitForDisplayed({ timeout: 5000 });
  await tab.click();

  console.log(`>>> clicked ${name} tab`);
}

// Taps the tab, then records what the screen looks like. Retries up to 3 times.
async function openTab(name: string, isOpen: () => Promise<boolean>) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`>>> ${name} tab: tap attempt ${attempt}`);
    await tapTabOnce(name);
    await browser.pause(1500);

    // Evidence: screenshot + first visible texts on screen.
    await browser.saveScreenshot(`./tab-${name}-attempt${attempt}-${Date.now()}.png`);

    const src = await browser.getPageSource();
    const texts = [...src.matchAll(/ text="([^"]+)"/g)]
      .map((m) => m[1])
      .slice(0, 15);

    console.log(`>>> visible texts: ${texts.join(' | ')}`);

    if (await isOpen()) return;
  }

  throw new Error(`${name} tab did not open after 3 taps`);
}

// QUICK ACTIONS only exists on the dashboard screen.
const onDashboard = async () =>
  (await browser.getPageSource()).includes('QUICK ACTIONS');

// ---------- T-MOB-GEST-001 (unchanged) ----------
When('I swipe left on the mobile balance card', async () => {
  cardXBefore = (await dashboard.pendingApprovalsTitle.getLocation()).x;
  await MobileActions.swipeLeftOn(dashboard.netWorthTitle);
});

Then('the next mobile dashboard card should be visible', async () => {
  const xAfter = (await dashboard.pendingApprovalsTitle.getLocation()).x;
  expect(xAfter).toBeLessThan(cardXBefore);
});

// ---------- T-MOB-GEST-002 ----------
When('I tap the mobile history tab', async () => {
  await browser.pause(2000); // Let the dashboard finish loading first.
  await openTab('History', async () => !(await onDashboard()));
  await browser.pause(4000); // So you can watch the History screen.
});

When('I tap the mobile dashboard tab', async () => {
  await openTab('Dashboard', onDashboard);
  await dashboard.netWorthTitle.waitForDisplayed({ timeout: 5000 });
  await browser.pause(3000);
});

When('I long press the mobile balance card', async () => {
  await MobileActions.longPress(dashboard.netWorthTitle);
  await browser.pause(2000);
});

Then('the mobile dashboard should remain stable', async () => {
  await expect(dashboard.netWorthTitle).toBeDisplayed();
  await expect(dashboard.quickActionsLabel).toBeDisplayed();
});