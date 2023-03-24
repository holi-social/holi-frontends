import { Page, expect } from '@playwright/test'

import {
  clickElementByTestId,
  donationsRequestTimeout,
  goodnewsRequestTimeout,
  proceedAsGuest,
  volunteeringRequestTimeout,
  waitForElementByTestId,
  waitForElementByTestIdToBeDetached,
} from './helpers'
import { test } from './testmaster'

test.describe('@AppsDrawer', () => {
  test('user journey', async ({ page }) => {
    // prepare
    await proceedAsGuest(page)

    await openAppAndReturn(page, 'volunteering', volunteeringRequestTimeout)
    await openAppAndReturn(page, 'goodnews', goodnewsRequestTimeout)
    await openAppAndReturn(page, 'donations', donationsRequestTimeout)
  })
})

const openAppAndReturn = async (page: Page, appName: string, appTimeout: number) => {
  // find and click apps button
  await waitForElementByTestId(page, 'home-apps-button')
  await clickElementByTestId(page, 'home-apps-button')

  // apps drawer is open and contain apps
  await waitForElementByTestId(page, 'apps-drawer-modal')

  // open the app
  await clickElementByTestId(page, `app-tile-${appName}`)

  // apps button has disappeared and drawer is gone
  await Promise.all([
    expect(page.getByTestId('apps-drawer-modal')).not.toBeVisible(),
    expect(page.getByTestId('home-apps-button')).not.toBeVisible(),
  ])

  // app is open
  await waitForElementByTestId(page, `${appName}-list-container`, { timeout: appTimeout })
  expect(page.url()).toContain(`/apps/${appName}`)

  // go back home
  await clickElementByTestId(page, 'nav-button-back')
}
