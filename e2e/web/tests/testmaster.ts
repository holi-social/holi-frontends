import { type Browser, type BrowserContext, type Page, test as baseTest } from '@playwright/test'

import { gotoWithRetries } from './helpers'
import { denyConsent, withRandomUserSession } from './helpers'
import { type User, deleteAuthenticatedAccount, signUp } from './helpers/api'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'

type Session = {
  page: Page
  user: User
  //api: { createSpace: () => void }
}

export class UserHandler {
  private browser: Browser
  private sessions: (() => Promise<void>)[] = []

  constructor(browser: Browser) {
    this.browser = browser
  }

  public async asRandomUser(
    actions: (page: Page, userFullName: string) => Promise<void>,
    {
      email,
      password,
      userData,
      expectedScreen,
    }: {
      email?: string
      password?: string
      userData?: OnboardingUserData
      expectedScreen?: string
    } = {}
  ) {
    this.sessions.push(
      await withRandomUserSession(this.browser, actions, { email, password, userData, expectedScreen })
    )
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

  public async signUp(email?: string, password?: string): Promise<Session> {
    const context = await this.browser.newContext()

    const user = await signUp(context, email, password)
    this.signInContexts.push(context)

    const newPage = await context.newPage()
    //Introduced exception handling if first attempt to hit the server does not succeed
    try {
      // First attempt to navigate normally
      await newPage.goto('/')
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Initial navigation to '/' failed: ${error.message}`)
      } else {
        console.error("Initial navigation to '/' failed with an unknown error.")
      }

      // If the initial attempt fails, fall back to retry logic
      await gotoWithRetries(newPage, '/')
    }
    await denyConsent(newPage)

    return {
      user,
      page: newPage,
      // TODO: expand to enable setting up data for test runs, without having to drive the UI (slow)
      // api: {
      //   createSpace: () => {//make it so via GQL calls},
      // },
    }
  }

  public async cleanup() {
    await Promise.allSettled(
      this.signInContexts.map(async (ctx) => {
        await deleteAuthenticatedAccount(ctx)
        await ctx.close()
      })
    )
  }
}

export const test = baseTest.extend<{
  userHandler: UserHandler
  sessions: SessionHandler
  authenticatedSession: Session
}>({
  userHandler: async ({ browser }, use) => {
    const userHandler = new UserHandler(browser)
    await use(userHandler)
    await userHandler.cleanup()
  },
  sessions: async ({ browser }, use) => {
    const api = new SessionHandler(browser)
    await use(api)
    await api.cleanup()
  },
  authenticatedSession: async ({ browser }, use) => {
    const api = new SessionHandler(browser)
    const session = await api.signUp()
    await use(session)
    await api.cleanup()
  },
})
