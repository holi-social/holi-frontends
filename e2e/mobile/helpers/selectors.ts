// https://webdriver.io/docs/selectors
const byTestId = (testID: string) => (platform === 'ios' ? `~${testID}` : `//*[@resource-id='${testID}']`)

const waitForElement = async (elementSelector: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(elementSelector)

  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout })

  return element
}

export const waitForElementWithTestIdToBeNull = async (testId: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(byTestId(testId))

  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout, reverse: true })

  return element
}

export const scrollToElementWithTestId = async (testId: string, timeout?: number) => {
  const selector =
    platform === 'ios'
      ? byTestId(testId)
      : `android=new UiScrollable(new UiSelector().scrollable(true).instance(0)).scrollIntoView(new UiSelector().resourceId("${testId}"))`
  const element = await Appium.$(selector)

  await element.waitForDisplayed({ timeout })

  return element
}

export const checkIfElementWithTestIdExists = async (testId: string) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(byTestId(testId))

  // https://webdriver.io/docs/api/element/isExisting
  return element.isExisting()
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
  // https://webdriver.io/docs/api/element/touchAction

  try {
    const element = await waitForElementWithTestId(testId, timeout)
    await Appium.touchAction({ element, action: 'tap' })

    return element
  } catch (err) {
    console.error(`FAILED: Tap "${testId}"`)
  }
}

export const fillFieldByTestId = async (testId: string, value: string) => {
  try {
    const element = await tapOnElementWithTestId(testId)
    // https://webdriver.io/docs/api/element/setValue
    await element.setValue(value)
  } catch (err) {
    console.error(`FAILED: Fill input "${testId}" with value "${value}"`)
  }
}
