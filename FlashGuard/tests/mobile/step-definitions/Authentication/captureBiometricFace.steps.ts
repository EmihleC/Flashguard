import { Given, When, Then, Before  } from '@cucumber/cucumber';
// ======================================================
// MOB-AUTH-03.2: CAMERA FACE-CHECK AUTHENTICATION
// ======================================================

// Camera face-check elements
const cameraFaceCheckButton = () =>
  $('android=new UiSelector().textContains("Sign in with Camera Face Check")');

const faceCheckModalTitle = () =>
  $('android=new UiSelector().text("Face Check")');

const cameraCancelButton = () =>
  $('android=new UiSelector().text("Cancel")');

const cameraPreviewStatus = (status: string) =>
  $(`android=new UiSelector().text("${status}")`);

const cameraAccessAlert = () =>
  $('android=new UiSelector().text("Camera access required")');

// System permission dialog buttons
const cameraAllowButton = () =>
  $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');

const cameraAllowOnceButton = () =>
  $('id=com.android.permissioncontroller:id/permission_allow_one_time_button');

const cameraDenyButton = () =>
  $('id=com.android.permissioncontroller:id/permission_deny_button');

async function verifyLoginScreen(): Promise<void> {
  await cameraFaceCheckButton().waitForDisplayed({
    timeout: 10000,
    timeoutMsg: 'Login screen was not displayed.'
  });
}

// MOB-AUTH-03.2: Open camera face-check

When('the merchant selects camera face-check', async () => {
  console.log('\n========== MOB-AUTH-03.2 CAMERA FACE-CHECK ==========');

  const button = cameraFaceCheckButton();

  await button.waitForDisplayed({
    timeout: 15000,
    timeoutMsg: 'Camera face-check button was not displayed.'
  });

  await button.click();

  console.log('Camera face-check selected.');
});


// MOB-AUTH-03.2: Grant camera permission if requested


When('the merchant grants camera permission if requested', async () => {
  console.log('\n========== CAMERA PERMISSION ==========');

  const allowButton = cameraAllowButton();
  const allowOnceButton = cameraAllowOnceButton();

  if (await allowButton.isDisplayed().catch(() => false)) {
    await allowButton.click();
    console.log('Selected: While using the app');
  } else if (await allowOnceButton.isDisplayed().catch(() => false)) {
    await allowOnceButton.click();
    console.log('Selected: Only this time');
  } else {
    console.log('Permission dialog not detected. Checking current permission state.');
  }

  // Wait for Android permission dialog to disappear.
  await driver.waitUntil(
    async () => {
      const allowVisible = await allowButton.isDisplayed().catch(() => false);
      const onceVisible = await allowOnceButton.isDisplayed().catch(() => false);

      return !allowVisible && !onceVisible;
    },
    {
      timeout: 15000,
      interval: 500,
      timeoutMsg: 'Android camera permission dialog did not close.'
    }
  );

  console.log('Android permission dialog closed.');

  await faceCheckModalTitle().waitForDisplayed({
    timeout: 20000,
    timeoutMsg: 'Face Check modal did not appear after permission was granted.'
  });

  console.log('Face Check modal displayed successfully.');
});


// MOB-AUTH-03.2: Verify camera readiness


Then('the camera preview should become ready', async () => {
  console.log('\n========== CAMERA FACE-CHECK PROGRESS ==========');

  const checkingStatus = cameraPreviewStatus('Checking your smile...');
  const acceptedStatus = cameraPreviewStatus('Smile accepted. Signing you in...');
  const dashboard = $('android=new UiSelector().text("Alice Ledger")');

  await driver.waitUntil(async () => {
    const checking = await checkingStatus.isDisplayed().catch(() => false);
    const accepted = await acceptedStatus.isDisplayed().catch(() => false);
    const loggedIn = await dashboard.isDisplayed().catch(() => false);

    return checking || accepted || loggedIn;
  }, {
    timeout: 30000,
    interval: 500,
    timeoutMsg: 'Camera capture did not start or complete, and dashboard access was not detected.'
  });

  console.log('Camera face-check progressed beyond its initial state.');
});



// MOB-AUTH-03.2: Verify automatic capture


Then('the camera face-check should complete', async () => {
  console.log('\n========== CAMERA FACE-CHECK COMPLETION ==========');

  const dashboard = $('android=new UiSelector().text("Alice Ledger")');

  await dashboard.waitForDisplayed({
    timeout: 30000,
    timeoutMsg: 'Camera face-check did not result in successful dashboard access.'
  });

  console.log('Camera face-check flow resulted in dashboard access.');
});



// MOB-AUTH-03.2: Cancel camera face-check

When('the merchant cancels camera face-check', async () => {
  const cancelButton = cameraCancelButton();

  await cancelButton.waitForDisplayed({
    timeout: 10000,
    timeoutMsg: 'Camera cancellation button was not displayed.'
  });

  await cancelButton.click();

  console.log('Merchant cancelled camera face-check.');
});

Then('the camera face-check modal should close', async () => {
  await faceCheckModalTitle().waitForDisplayed({
    timeout: 5000,
    reverse: true,
    timeoutMsg: 'Camera face-check modal did not close.'
  });

  console.log('Camera face-check modal closed.');
});

Then('the merchant should remain on the login screen', async () => {
  await verifyLoginScreen();

  const dashboard = $('android=new UiSelector().text("Alice Ledger")');

  await dashboard.waitForDisplayed({
    timeout: 3000,
    reverse: true,
    timeoutMsg: 'Dashboard appeared when the merchant should remain unauthenticated.'
  });

  console.log('Merchant remains unauthenticated on the login screen.');
});


// MOB-AUTH-03.2: Deny camera permission

When('the merchant denies camera permission', async () => {
  console.log('\n========== CAMERA PERMISSION DENIAL ==========');

  const denyButton = cameraDenyButton();

  await denyButton.waitForDisplayed({
    timeout: 15000,
    timeoutMsg: 'Android camera permission dialog was not displayed.'
  });

  await denyButton.click();

  console.log('Camera permission denied successfully.');
});

Then('the camera access required alert should be displayed', async () => {
  await cameraAccessAlert().waitForDisplayed({
    timeout: 10000,
    timeoutMsg: 'Camera access required alert was not displayed.'
  });

  console.log('Camera access required alert displayed.');

  const okButton = $('android=new UiSelector().text("OK")');

  await okButton.waitForDisplayed({ timeout: 5000 });
  await okButton.click();

  console.log('Camera permission alert dismissed.');
});
