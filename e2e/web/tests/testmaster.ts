import { Browser, BrowserContext, Page, test as baseTest } from '@playwright/test'

import { withRandomUserSession } from './helpers'

export class UserHandler {
  private browser: Browser
  private sessions: (() => Promise<void>)[] = []

  constructor(browser: Browser) {
    this.browser = browser
  }

  public async asRandomUser(actions: (page: Page) => Promise<void>) {
    this.sessions.push(await withRandomUserSession(this.browser, actions))
  }

  public async cleanup() {
    await Promise.allSettled(this.sessions.map((fn) => fn()))
  }
}

export const test = baseTest.extend<{ userHandler: UserHandler; asGuest: Page; asE2EUser: Page }>({
  userHandler: async ({ browser, context, page }, use) => {
    const userHandler = new UserHandler(browser)
    await use(userHandler)
    await userHandler.cleanup()
  },
})
