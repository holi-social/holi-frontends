import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const baseURL = process.env.BASE_URL || 'https://staging.web.project-holi.org'

/**
 * We need retries due to flakyness caused by unknown reasons.
 * If you edit retries, make sure that the use.trace, use.screenshot and use.video settings match accordingly.
 */
const retries = 2

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 60000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  // parallel tests cause flakiness
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  // please edit the variable, not this setting, because other settings depend on it.
  retries: retries,
  use: {
    /* Collect traces when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: retries == 0 ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: retries == 0 ? 'retain-on-failure' : 'on-first-retry',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 10000,
    navigationTimeout: 10000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,

    headless: process.env.CI ? true : !!process.env.HEADLESS || true,
  },

  /* Configure projects for major browsers */
  projects: [
    /* Test against desktop viewports. */
    {
      name: 'Desktop_Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    /* Test against mobile viewports. */
    /**
     * Mobile Safari maybe still has an issue when running on Playwright's official docker image and
     * is leading to flakiness, with a problem debugging/tracing it:
     * https://github.com/microsoft/playwright/issues/11812
     */
    {
      name: 'Mobile_WebKit',
      use: devices['iPhone 12'],
    },
    {
      name: 'Mobile_Chrome',
      use: devices['Pixel 5'],
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
