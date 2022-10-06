import { expect, test } from '@playwright/test'

import { byTestId, clickElementByTestId, waitForAnimationEnd, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@AppsDrawer', () => {
  test('should be visible and opens drawer', async ({ page }) => {
    // find and click apps button
    await waitForElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'home-apps-button')

    // apps drawer is open and contain apps
    await waitForAnimationEnd(page.locator(byTestId('apps-drawer-modal-animatedview')))
    await waitForElementByTestId(page, 'apps-drawer-modal')
    await waitForElementByTestId(page, 'app-tile-donations')

    // open an app
    await clickElementByTestId(page, 'app-tile-donations')

    // app is open, apps button has disappeared and drawer is gone
    await waitForAnimationEnd(page.locator(byTestId('apps-drawer-modal-animatedview')))
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
