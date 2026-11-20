
import { existsSync } from 'node:fs';
import path from 'node:path';

if (
    process.platform === 'win32' &&
    !process.env.ANDROID_HOME &&
    !process.env.ANDROID_SDK_ROOT &&
    process.env.LOCALAPPDATA
) {
    const defaultAndroidSdk = path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk');

    if (existsSync(defaultAndroidSdk)) {
        process.env.ANDROID_HOME = defaultAndroidSdk;
        process.env.ANDROID_SDK_ROOT = defaultAndroidSdk;
    }
}

export const config: WebdriverIO.Config = {
    runner: 'local',

    framework: 'cucumber',

    services: [
        ['appium', { appiumStartTimeout: 60000 }]
    ],

    cucumberOpts: {
        require: [
            path.resolve(
                __dirname,
                'step-definitions/**/*.ts'
            )
        ],

        timeout: 120000,
        tags: '@mobile',
        strict: true,
        failFast: true
    },

    specs: [
        path.resolve(__dirname, 'features/**/*.feature')
    ],

    maxInstances: 1,

    hostname: '127.0.0.1',
    port: 4723,
    path: '/',

    capabilities: [{
        platformName: 'Android',

        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'emulator-5554',
        'appium:udid': 'emulator-5554',

        'appium:appPackage': 'com.anonymous.flashguadmobileapp',
        'appium:appActivity': '.MainActivity',
        'appium:appWaitDuration': 90000,

        'appium:adbExecTimeout': 120000,
        'appium:uiautomator2ServerLaunchTimeout': 90000,
        'appium:uiautomator2ServerInstallTimeout': 90000,
        'appium:noReset': false,
        'appium:forceAppLaunch': true,
        'appium:newCommandTimeout': 120
    }],

    logLevel: 'info',


    reporters: ['spec']
};
