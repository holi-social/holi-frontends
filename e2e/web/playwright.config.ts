import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

const baseURL = process.env.BASE_URL || 'https://staging.dev.holi.social'

/**
 * We need retries due to flakyness caused by unknown reasons.
 * If you edit retries, make sure that the use.trace, use.screenshot and use.video settings match accordingly.
 */
const intFromEnvOrDefault = (value: string | undefined, defaultValue: number): number => {
  if (value) {
    try {
      return Number.parseInt(value)
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
  {
    name: 'Mobile_Chrome',
    use: {
      ...devices['Pixel 5'],
      permissions: ['clipboard-read'],
      channel: 'chromium',
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

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 60_000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5_000,
  },
  // parallel tests don't work as some tests use the same account
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'playwright-report/junit-report.xml' }],
  ],
  // please edit the variable, not this setting, because other settings depend on it.
  retries: retries,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,
    headless: process.env.CI ? true : !!process.env.HEADLESS || true,
  },

  projects: browsersFromEnv(process.env.E2E_WEB_BROWSERS),

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',
}

if (process.env.BUILD && !process.env.CI) {
  config.webServer = {
    command: 'cd ../../apps/web && npm run build && npm run start',
    port: 3000,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  }
}

export default config
