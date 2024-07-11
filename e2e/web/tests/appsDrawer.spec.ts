import { Page, expect } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  donationsRequestTimeout,
  proceedAsGuest,
  volunteeringRequestTimeout,
  waitForAnimationEnd,
} from './helpers'
import { test } from './testmaster'

test.describe('@AppsDrawer', () => {
  test('user journey', async ({ page }) => {
    // prepare
    await proceedAsGuest(page)

    await openAppAndReturn(page, 'volunteering', volunteeringRequestTimeout)
    await openAppAndReturn(page, 'donations', donationsRequestTimeout)
  })
})

const openAppAndReturn = async (page: Page, appName: string, appTimeout: number) => {
  // find and click apps button
  await clickElementByTestId(page, 'home-apps-button')

  // apps drawer is open and contain apps
  await page.waitForSelector(byTestId('apps-drawer-modal'))

  await waitForAnimationEnd(page, byTestId('apps-drawer-modal-animatedview'))

  // open the app
  await clickElementByTestId(page, `app-tile-${appName}`)

  // app is open
  await page.waitForSelector(byTestId(`${appName}-list-container`), { timeout: appTimeout })
  expect(page.url()).toContain(`/${appName}`)

  // go back home
  await clickElementByTestId(page, 'nav-button-back')
}
