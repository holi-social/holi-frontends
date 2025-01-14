import { Page } from '@playwright/test'

import { test } from '@holi/e2e-web/tests/testmaster'

// eslint-disable-next-line no-restricted-imports
import { byTestId, clickElementByTestId, locateElementByTestId } from '../helpers'

export const createSpace = async (page: Page, initialName = 'e2e space name', initialGoal = 'e2e space goal') => {
  await test.step('space can be created', async () => {
    await clickElementByTestId(page, 'btn-to-spaces')
    await clickElementByTestId(page, 'btn-create-space')

    await inputSpaceNameAndGoal(page, initialName, initialGoal)
    await clickElementByTestId(page, 'holi-wizard-save-btn')

    const termCheckboxes = page.locator(`${byTestId('space-terms-list')} >> [role="switch"]`)
    await termCheckboxes.nth(0).click()
    await clickElementByTestId(page, 'holi-wizard-save-btn')

    await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')
    await clickElementByTestId(page, 'holi-wizard-save-btn')

    try {
      await clickElementByTestId(page, 'space-onboard-content-close-btn')
    } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      // sometimes the modal doesn't show
      // just continue
    }

    try {
      await clickElementByTestId(page, 'space-edit-close')
    } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      // sometimes space creation does not end in edit mode
      // just continue
    }
  })
}

export const inputSpaceNameAndGoal = async (page: Page, name: string, goal: string) => {
  const nameInput = await locateElementByTestId(page, 'space-name-input')
  await nameInput.fill(name)

  const goalInput = await locateElementByTestId(page, 'space-goal-input')
  await goalInput.fill(goal)
}
