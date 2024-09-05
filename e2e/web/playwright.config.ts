import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

// eslint-disable-next-line @typescript-eslint/no-var-requires
// require('dotenv').config({ path: '.envrc' })

import dotenv from 'dotenv'

// Load environment variables from .envrc file (or you can specify .env if needed)
dotenv.config({ path: '/holi-meta/holi-frontends/.env.staging' })

/*Ensures env variable is set from .env.staging file. This is to setup E2E user properly for staging*/
require('dotenv').config({ path: '/holi-meta/holi-frontends/.env.staging'})
const baseURL = process.env.BASE_URL || 'https://staging.dev.holi.social'

/**
 * We need retries due to flakyness caused by unknown reasons.
 * If you edit retries, make sure that the use.trace, use.screenshot and use.video settings match accordingly.
 */
const intFromEnvOrDefault = (value: string | undefined, defaultValue: number): number => {
  if (value) {
    try {
      return parseInt(value)
    } catch (e) {
      console.warn(`Can't parse value '${value}' for number of test retries, continuing with value '${defaultValue}'.`)
    }
  }
  return defaultValue
}
const retries = intFromEnvOrDefault(process.env.E2E_WEB_RETRIES, 0)

const possibleBrowsers = [
  {
    name: 'Desktop_Firefox',
    use: devices['Desktop Firefox'],
    runAsDefault: true,
  },
  /* Test against mobile viewports. */
  /**
   * Mobile Safari maybe still has an issue when running on Playwright's official docker image and
   * is leading to flakiness, with a problem debugging/tracing it:
   * https://github.com/microsoft/playwright/issues/11812
   */
  {
    name: 'Mobile_WebKit',
    use: {
      ...devices['iPhone 12'],
      // fix for the above issue, see https://github.com/microsoft/playwright/issues/11812#issuecomment-1466163509
      viewport: {
        width: 390,
        height: 844,
      },
    },
    runAsDefault: true,
  },
  {
    name: 'Mobile_Chrome',
    use: {
      ...devices['Pixel 5'],
      permissions: ['clipboard-read'],
    },
    runAsDefault: true,
  },
]

const browsersFromEnv = (value: string | undefined): object[] => {
  if (value) {
    return value.split(',').map((name) => {
      const match = possibleBrowsers.find((browser) => browser.name === name)
      if (match) {
        return match
      } else {
        throw new Error(`Browser ${name} not defined.`)
      }
    })
  }
  return possibleBrowsers.filter((browser) => browser.runAsDefault)
}
const browsers = browsersFromEnv(process.env.E2E_WEB_BROWSERS)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 300_000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5_000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  // parallel tests cause flakiness
  workers: process.env.CI ? 4 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  // please edit the variable, not this setting, because other settings depend on it.
  retries: retries,
  use: {
    /**
     * Collect traces when retrying the failed test. See https://playwright.dev/docs/trace-viewer
     * We prioritize debuggability over saving storage space here. With a setting of
     * on-first-retry, we might not get a trace for flaky tests and would be less able to debug.
     */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: process.env.CI ? 10_000 : 20_000,
    navigationTimeout: process.env.CI ? 20_000 : 30_000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,
    headless: process.env.CI ? true : !!process.env.HEADLESS || true,
  },

  /* Configure projects for major browsers */
  projects: browsers,

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
