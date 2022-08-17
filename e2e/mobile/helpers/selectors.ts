// https://webdriver.io/docs/selectors
const byTestId = (testID: string) => (platform === 'ios' ? `~${testID}` : `//*[@resource-id='${testID}']`)

const waitForElement = async (elementSelector: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(elementSelector)
  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout })
  return element
}

export const waitForElementWithTestId = async (testId: string, timeout?: number) =>
  waitForElement(byTestId(testId), timeout)

export const seeTextWithTestId = async (expectedText: string, testId: string) => {
  const element = await waitForElementWithTestId(testId)
  // https://webdriver.io/docs/api/element/getText
  const text = await element.getText()
  expect(text).toMatch(expectedText)
}

export const tapOnElementWithTestId = async (testId: string, timeout?: number) => {
  const element = await waitForElementWithTestId(testId, timeout)
  // https://webdriver.io/docs/api/element/touchAction
  await Appium.touchAction({ element, action: 'tap' })
}

export const fillFieldByTestId = async (testId: string, value: string) => {
  // await this.tapOnElementWithTestId(testId)
  // await Appium.type(value)

  const elementSelector = byTestId(testId)
  await waitForElement(elementSelector)
  await Appium.fillField(elementSelector, value)
}
