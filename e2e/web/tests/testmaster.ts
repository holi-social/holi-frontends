import { type Browser, type BrowserContext, type Page, test as baseTest } from '@playwright/test'

import { withRandomUserSession } from './helpers'
import {
  type E2ETestSpaceResponse,
  type E2ETestSpaceTaskResponse,
  type User,
  createSpace,
  createSpaceTask,
  deleteAuthenticatedAccount,
  signUp,
} from './helpers/api'

type Session = {
  page: Page
  user: User
  api: {
    createSpace: () => Promise<E2ETestSpaceResponse>
    createSpaceTask: (spaceId: string) => Promise<E2ETestSpaceTaskResponse>
  }
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
      userData?: boolean
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
    await newPage.goto('/')

    return {
      user,
      // todo gregor: rename to newBrowserPage to communicate its not just a new tab based b/c newContext above
      page: newPage,
      // TODO: expand to enable setting up data for test runs, without having to drive the UI (slow)
      api: {
        createSpace: () => createSpace(context),
        createSpaceTask: (spaceId: string) => createSpaceTask(context, spaceId),
      },
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
