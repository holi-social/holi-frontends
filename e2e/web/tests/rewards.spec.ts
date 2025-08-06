import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

import { byTestId, clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

test.describe('@Rewards', () => {
  test('shows rewards modal when creating good deeds post', async ({ sessions }) => {
    const { page: user } = await sessions.signUp()

    await test.step('user creates a good deeds post', async () => {
      await user.goto('/')
      await clickElementByTestId(user, 'create-post-button')
      await handleOnboardingModal(user)
      await waitForPostForm(user)
      await selectGoodDeedsCategory(user)

      const postTitle = `Good Deed Post ${faker.string.alphanumeric(5)}`
      await fillPostDetails(user, postTitle, 'This is a good deed post for testing rewards')
      await clickElementByTestId(user, 'submit-post-button')
    })

    await test.step('rewards modal appears with correct content', async () => {
      await user.waitForSelector(byTestId('reward-message-container'))

      const modalText = await locateElementByTestId(user, 'reward-message-text')
      await expect(modalText).toBeVisible()
      await expect(modalText).toContainText('Your contribution counts as a good deed')

      const modalLink = await locateElementByTestId(user, 'reward-message-link')
      await expect(modalLink).toBeVisible()
      await expect(modalLink).toContainText('More about #1MioguteTaten')

      const claimButton = await locateElementByTestId(user, 'reward-claim-button')
      await expect(claimButton).toBeVisible()
      await expect(claimButton).toContainText('Claim')

      await user.waitForSelector(byTestId('good-deeds-counter-animation'))
    })

    await test.step('user can claim the reward and return to home', async () => {
      await clickElementByTestId(user, 'reward-claim-button')
      await user.waitForSelector(byTestId('home-feed-listing'))
    })
  })

  test('does not show rewards modal for regular posts', async ({ sessions }) => {
    const { page: user } = await sessions.signUp()

    await test.step('user creates a regular post', async () => {
      await user.goto('/')
      await clickElementByTestId(user, 'create-post-button')
      await handleOnboardingModal(user)
      await waitForPostForm(user)
      await selectRegularCategory(user)

      const postTitle = `Regular Post ${faker.string.alphanumeric(5)}`
      await fillPostDetails(user, postTitle, 'This is a regular post for testing')
      await clickElementByTestId(user, 'submit-post-button')
    })

    await test.step('no rewards modal appears', async () => {
      const modalExists = await user.locator(byTestId('reward-message-container')).count()
      expect(modalExists).toBe(0)

      await user.waitForSelector(byTestId('home-feed-listing'))
      await user.waitForSelector(byTestId('toast-SUCCESS'))
    })
  })

  test('updates good deeds counter', async ({ sessions }) => {
    const { page: user } = await sessions.signUp()

    await test.step('check initial counter state', async () => {
      await user.goto('/')
      const counterExists = await user.locator(byTestId('good-deeds-counter')).count()
      if (counterExists > 0) {
        await user.waitForSelector(byTestId('good-deeds-counter-value'))
      }
    })

    await test.step('create first good deeds post and claim reward', async () => {
      await clickElementByTestId(user, 'create-post-button')
      await handleOnboardingModal(user)
      await waitForPostForm(user)

      const postTitle = `First Good Deed Post ${faker.string.alphanumeric(5)}`
      await fillPostDetails(user, postTitle, 'This is the first good deed post')
      await selectGoodDeedsCategory(user)
      await clickElementByTestId(user, 'submit-post-button')

      await user.waitForSelector(byTestId('reward-message-container'))
      await clickElementByTestId(user, 'reward-claim-button')
    })

    await test.step('verify counter has increased after first post', async () => {
      await user.waitForSelector(byTestId('good-deeds-counter'))
      await user.waitForSelector(byTestId('good-deeds-counter-value'))

      const counterValue = await user.locator(byTestId('good-deeds-counter-value')).textContent()
      const firstPostCount = Number.parseInt(counterValue || '0', 10)
      expect(firstPostCount).toBeGreaterThan(0)
    })

    await test.step('create second good deeds post', async () => {
      await clickElementByTestId(user, 'create-post-button')
      await waitForPostForm(user)

      const postTitle = `Second Good Deed Post ${faker.string.alphanumeric(5)}`
      await fillPostDetails(user, postTitle, 'This is the second good deed post')
      await selectGoodDeedsCategory(user)
      await clickElementByTestId(user, 'submit-post-button')
    })

    await test.step('verify counter shows correct value for multiple posts', async () => {
      await user.waitForSelector(byTestId('reward-message-container'))

      const modalCounterValue = await user.locator(byTestId('good-deeds-counter-final')).textContent()
      const modalCount = Number.parseInt(modalCounterValue || '0', 10)
      expect(modalCount).toBe(2)

      await clickElementByTestId(user, 'reward-claim-button')

      await user.waitForSelector(byTestId('good-deeds-counter'))
      const homeCounter = await locateElementByTestId(user, 'good-deeds-counter-value')
      await expect(homeCounter).toBeVisible()

      const finalCounterValue = await homeCounter.textContent()
      const finalCount = Number.parseInt(finalCounterValue || '0', 10)
      expect(finalCount).toBe(2)
    })
  })
})

async function handleModal(user: Page, modalTestId: string, closeButtonTestId: string) {
  await user.waitForSelector(byTestId(modalTestId))
  await user.waitForTimeout(1000)

  await clickElementByTestId(user, closeButtonTestId)

  await user.waitForSelector(byTestId(modalTestId), { state: 'hidden' })
}

async function handleOnboardingModal(user: Page) {
  await handleModal(user, 'post-onboard-content', 'btn-to-close-post-onboard-modal')
}

async function waitForPostForm(user: Page) {
  await user.waitForTimeout(2000)

  await user.waitForSelector(byTestId('create-post-loader'), { state: 'hidden' })

  const loaderCount = await user.locator(byTestId('create-post-loader')).count()
  if (loaderCount > 0) {
    await user.waitForSelector(byTestId('create-post-loader'), { state: 'hidden' })
  }
}

async function fillPostDetails(user: Page, title: string, description: string) {
  const titleInput = await locateElementByTestId(user, 'post-title-input')
  await titleInput.fill(title)
  const descriptionInput = await locateElementByTestId(user, 'post-description-input')
  await descriptionInput.fill(description)
}

async function handleCategorySelectionModal(user: Page) {
  await handleModal(user, 'category-selection-modal', 'btn-to-close-category-selection-modal')
}

async function selectGoodDeedsCategory(user: Page) {
  await clickElementByTestId(user, 'post-category-pill')
  await user.waitForSelector(byTestId('category-selection-modal'))
  await clickElementByTestId(user, 'category-1-million-good-deeds')
  await handleCategorySelectionModal(user)
}

async function selectRegularCategory(user: Page) {
  await clickElementByTestId(user, 'post-category-pill')
  await user.waitForSelector(byTestId('category-selection-modal'))
  await clickElementByTestId(user, 'category-recommendation')
  await handleCategorySelectionModal(user)
}
