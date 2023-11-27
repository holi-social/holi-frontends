import { Browser, Page, test as baseTest } from '@playwright/test'

import { withRandomUserSession } from './helpers'

export class UserHandler {
  private browser: Browser
  private sessions: (() => Promise<void>)[] = []

  constructor(browser: Browser) {
    this.browser = browser
  }

  public async asRandomUser(
    actions: (page: Page, userId: string, userFullName: string) => Promise<void>,
    email?: string,
    password?: string
  ) {
    this.sessions.push(await withRandomUserSession(this.browser, actions, email, password))
  }

  public async cleanup() {
    await Promise.allSettled(this.sessions.map((fn) => fn()))
  }
}

export const test = baseTest.extend<{ userHandler: UserHandler; asGuest: Page; asE2EUser: Page }>({
  userHandler: async ({ browser }, use) => {
    const userHandler = new UserHandler(browser)
    await use(userHandler)
    await userHandler.cleanup()
  },
})
