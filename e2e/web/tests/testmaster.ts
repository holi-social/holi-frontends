import { Browser, BrowserContext, Page, test as baseTest } from '@playwright/test'

import { newUserEmail, randomPassword, withRandomUserSession } from './helpers'
import { deleteAuthenticatedAccount, denyTracking, signUp } from './helpers/api'

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

export class SessionHandler {
  private browser: Browser
  private signInContexts: BrowserContext[] = []

  constructor(browser: Browser) {
    this.browser = browser
  }

  public async signUp(email: string = newUserEmail(), password: string = randomPassword()) {
    const context = await this.browser.newContext()

    await signUp(context, email, password)
    this.signInContexts.push(context)

    const newPage = await context.newPage()
    await newPage.goto('/')
    await denyTracking(newPage)

    return {
      page: newPage,
      api: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        todo: () => {},
      },
    }
  }

  public async cleanup() {
    await Promise.allSettled(
      this.signInContexts.map(async (ctx) => {
        await deleteAuthenticatedAccount(ctx)
      })
    )
  }
}

export const test = baseTest.extend<{ userHandler: UserHandler; session: SessionHandler }>({
  userHandler: async ({ browser }, use) => {
    const userHandler = new UserHandler(browser)
    await use(userHandler)
    await userHandler.cleanup()
  },
  session: async ({ browser }, use) => {
    const api = new SessionHandler(browser)
    await use(api)
    await api.cleanup()
  },
})
