import { type Browser, type BrowserContext, type Page, test as baseTest } from '@playwright/test'

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
      page: newPage,
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
  sessions: SessionHandler
  authenticatedSession: Session
}>({
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
