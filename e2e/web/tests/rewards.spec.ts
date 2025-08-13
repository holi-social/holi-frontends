import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

import { byTestId, clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

test.describe('@Rewards', () => {
  test('verify rewards flow', async ({ sessions }) => {
    const { page: user } = await sessions.signUp()

    await test.step('initial counter does not show good deed count', async () => {
      await user.goto('/')
      const counterLabelText = await user.locator(byTestId('good-deeds-counter')).textContent()
      expect(counterLabelText).toStrictEqual('Good Deeds')
    })

    await test.step('create first good deeds post and verify rewards modal', async () => {
      await clickElementByTestId(user, 'create-post-button')
      await handleOnboardingModal(user)
      await waitForPostForm(user)
      await selectGoodDeedsCategory(user)

      const postTitle = `First Good Deed Post ${faker.string.alphanumeric(5)}`
      await fillPostDetails(user, postTitle, 'This is the first good deed post for testing rewards')
      await clickElementByTestId(user, 'submit-post-button')

      // Verify rewards modal appears with correct content
      await user.waitForSelector(byTestId('reward-message-container'))

      const modalText = await locateElementByTestId(user, 'reward-message-text')
      await expect(modalText).toBeVisible()
      await expect(modalText).toContainText('Your contribution counts as a good deed')

      const modalLink = await locateElementByTestId(user, 'reward-message-link')
      await expect(modalLink).toBeVisible()
      await expect(modalLink).toContainText('More about #1MioGuteTaten')

      const claimButton = await locateElementByTestId(user, 'reward-claim-button')
      await expect(claimButton).toBeVisible()
      await expect(claimButton).toContainText('Claim')

      await user.waitForSelector(byTestId('good-deeds-counter-animation'))

      // Claim the reward
      await clickElementByTestId(user, 'reward-claim-button')
      await user.waitForSelector(byTestId('home-feed-listing'))
    })

    await test.step('verify counter has increased after first post', async () => {
      await user.waitForSelector(byTestId('good-deeds-counter'))
      await user.waitForSelector(byTestId('good-deeds-counter-value'))

      const counterValue = await user.locator(byTestId('good-deeds-counter-value')).textContent()
      const firstPostCount = Number.parseInt(counterValue || '0', 10)
      expect(firstPostCount).toBeGreaterThan(0)
    })

    await test.step('create second good deeds post and verify counter updates', async () => {
      await clickElementByTestId(user, 'create-post-button')
      await waitForPostForm(user)

      const postTitle = `Second Good Deed Post ${faker.string.alphanumeric(5)}`
      await fillPostDetails(user, postTitle, 'This is the second good deed post')
      await selectGoodDeedsCategory(user)
      await clickElementByTestId(user, 'submit-post-button')

      // Verify counter shows correct value for multiple posts
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

    await test.step('create regular post and verify no rewards modal appears', async () => {
      await clickElementByTestId(user, 'create-post-button')
      await waitForPostForm(user)
      await selectRegularCategory(user)

      const postTitle = `Regular Post ${faker.string.alphanumeric(5)}`
      await fillPostDetails(user, postTitle, 'This is a regular post for testing')
      await clickElementByTestId(user, 'submit-post-button')

      // Verify no rewards modal appears for regular posts
      const modalExists = await user.locator(byTestId('reward-message-container')).count()
      expect(modalExists).toBe(0)

      await user.waitForSelector(byTestId('home-feed-listing'))
      await user.waitForSelector(byTestId('toast-SUCCESS'))
    })

    await test.step('verify counter remains unchanged after regular post', async () => {
      await user.waitForSelector(byTestId('good-deeds-counter'))
      const homeCounter = await locateElementByTestId(user, 'good-deeds-counter-value')
      await expect(homeCounter).toBeVisible()

      const counterValue = await homeCounter.textContent()
      const count = Number.parseInt(counterValue || '0', 10)
      expect(count).toBe(2) // Should still be 2 from the good deeds posts
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
