import { expect } from '@playwright/test'

import { byTestId, clickElementByTestId, donationsRequestTimeout, proceedAsGuest } from './helpers'
import { test } from './testmaster'

test.describe('@AppsDrawer', () => {
  test('user journey', async ({ page }) => {
    await proceedAsGuest(page)
    // find and click apps button

    await page.waitForSelector(byTestId('home-apps-button'))
    await clickElementByTestId(page, 'home-apps-button')

    // apps drawer is open and contain apps
    await page.waitForSelector(byTestId('apps-drawer-modal'))

    // open an app
    await clickElementByTestId(page, 'app-tile-donations')

    // app is open, apps button has disappeared and drawer is gone
    await page.waitForSelector(byTestId('donations-list-container'), { timeout: donationsRequestTimeout })
    expect(page.url()).toContain('/apps/donations')
    const appsButtonIsVisible = await page.locator(byTestId('home-apps-button')).isVisible()
    expect(appsButtonIsVisible).not.toBeTruthy()
    const modalIsOpen = await page.locator(byTestId('apps-drawer-modal')).isVisible()
    expect(modalIsOpen).not.toBeTruthy()

    // go back home and see apps button again
    await clickElementByTestId(page, 'nav-button-back')
    await page.waitForSelector(byTestId('home-apps-button'))
  })
})
