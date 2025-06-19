import { type Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, donationsRequestTimeout, volunteeringRequestTimeout, withSSR } from './helpers'
import { test } from './testmaster'

test.describe('@ActPage', () => {
  test('user journey', async ({ page, browser }) => {
    await page.goto('/act')

    await testActPageContent(page)
    await withSSR(browser, page.url(), testActPageContent)

    await openAppAndReturn(page, 'volunteering', volunteeringRequestTimeout)
    await openAppAndReturn(page, 'donations', donationsRequestTimeout)
  })
})

const testActPageContent = async (page: Page) => {
  // act page is open and contain apps
  await page.waitForSelector(byTestId('volunteering-reco-slider'))
  await page.waitForSelector(byTestId('donations-reco-slider'))
}

const openAppAndReturn = async (page: Page, appName: string, appTimeout: number) => {
  // open the volunteering list
  await clickElementByTestId(page, `${appName}-reco-slider-heading-button`)

  // app is open
  await page.waitForSelector(byTestId(`${appName}-list-container`), { timeout: appTimeout })
  expect(page.url()).toContain(`/${appName}`)

  // go back to act home
  await clickElementByTestId(page, 'nav-button-back')
}
