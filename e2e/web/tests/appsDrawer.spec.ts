import { expect } from '@playwright/test'

import { byTestId, clickElementByTestId, proceedAsGuest, waitForElementByTestId } from './helpers'
import { test } from './testmaster'

test.describe('@AppsDrawer', () => {
  test('user journey', async ({ page }) => {
    await proceedAsGuest(page)
    // find and click apps button
    await waitForElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'home-apps-button')

    // apps drawer is open and contain apps
    await waitForElementByTestId(page, 'apps-drawer-modal')

    // open an app
    await clickElementByTestId(page, 'app-tile-donations')

    // app is open, apps button has disappeared and drawer is gone
    await waitForElementByTestId(page, 'donations-list-container')
    expect(page.url()).toContain('/apps/donations')
    const appsButtonIsVisible = await page.locator(byTestId('home-apps-button')).isVisible()
    expect(appsButtonIsVisible).not.toBeTruthy()
    const modalIsOpen = await page.locator(byTestId('apps-drawer-modal')).isVisible()
    expect(modalIsOpen).not.toBeTruthy()

    // go back home and see apps button again
    await clickElementByTestId(page, 'nav-button-back')
    await waitForElementByTestId(page, 'home-apps-button')
  })
})
