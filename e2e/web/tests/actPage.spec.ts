import { type Page, expect } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  denyConsent,
  donationsRequestTimeout,
  volunteeringRequestTimeout,
} from './helpers'
import { test } from './testmaster'

test.describe('@ActPage', () => {
  test('user journey', async ({ page }) => {
    await page.goto('/act')

    await denyConsent(page)

    // act page is open and contain apps
    await page.waitForSelector(byTestId('volunteering-reco-slider'))
    await page.waitForSelector(byTestId('tasks-reco-slider'))
    await page.waitForSelector(byTestId('donations-reco-slider'))

    await openAppAndReturn(page, 'volunteering', volunteeringRequestTimeout)
    await openAppAndReturn(page, 'donations', donationsRequestTimeout)
  })
})

const openAppAndReturn = async (page: Page, appName: string, appTimeout: number) => {
  // open the volunteering list
  await clickElementByTestId(page, `${appName}-reco-slider-heading-button`)

  // app is open
  await page.waitForSelector(byTestId(`${appName}-list-container`), { timeout: appTimeout })
  expect(page.url()).toContain(`/${appName}`)

  // go back home
  await clickElementByTestId(page, 'nav-button-back')
}
