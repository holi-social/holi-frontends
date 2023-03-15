import { Browser, Page, test as baseTest } from '@playwright/test'

import { withRandomUserSession } from './helpers'

export class UserHandler {
  private browser
  private sessions: (() => Promise<void>)[] = []

  constructor(browser: Browser) {
    this.browser = browser
  }

  public async withRandomUserSession(actions: (page: Page) => Promise<void>) {
    this.sessions.push(await withRandomUserSession(this.browser, actions))
  }

  public async cleanup() {
    await Promise.allSettled(this.sessions.map((fn) => fn()))
  }
}

export const test = baseTest.extend<{ userHandler: UserHandler }>({
  userHandler: async ({ browser }, use) => {
    const userHandler = new UserHandler(browser)
    await use(userHandler)
    await userHandler.cleanup()
  },
})
