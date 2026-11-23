import { When, Then } from '@wdio/cucumber-framework';
import { DashboardScreen } from '../../../../src/pages/mobile/DashboardScreen';
import { MobileActions } from '../../../../src/support/MobileActions';

const dashboard = new DashboardScreen();
let cardXBefore = 0;

When('I swipe left on the mobile balance card', async () => {
  cardXBefore = (await dashboard.pendingApprovalsTitle.getLocation()).x;
  await MobileActions.swipeLeftOn(dashboard.netWorthTitle);
});

Then('the next mobile dashboard card should be visible', async () => {
  const xAfter = (await dashboard.pendingApprovalsTitle.getLocation()).x;
  expect(xAfter).toBeLessThan(cardXBefore);
});

When('I tap the mobile history tab', async () => {
  await dashboard.navItem('History').click();
});

When('I tap the mobile dashboard tab', async () => {
  await dashboard.navItem('Dashboard').click();
});

When('I long press the mobile balance card', async () => {
  await MobileActions.longPress(dashboard.netWorthTitle);
});

Then('the mobile dashboard should remain stable', async () => {
  await expect(dashboard.netWorthTitle).toBeDisplayed();
  await expect(dashboard.quickActionsLabel).toBeDisplayed();
});