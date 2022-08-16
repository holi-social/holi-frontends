// TODO(SF) searching for text: `android=new UiSelector().text("${expectedText}")`)
const byTestId = (testID: string) => (platform === 'ios' ? `~${testID}` : `//*[@resource-id='${testID}']`)

// TODO(SF) add links to docs
const waitForElement = async (elementSelector: string, timeout?: number) => {
  const element = await Appium.$(elementSelector)
  await element.waitForDisplayed({ timeout })
  return element
}

export const seeElementWithTestId = async (testId: string, timeout?: number) => {
  await waitForElement(byTestId(testId), timeout)
}

export const seeTextWithTestId = async (expectedText: string, testId: string) => {
  const element = await waitForElement(byTestId(testId))
  const text = await element.getText()
  expect(text).toEqual(expectedText)
}

export const tapOnElementWithTestId = async (testId: string) => {
  const element = await waitForElement(byTestId(testId))
  await Appium.touchAction({ element, action: 'tap' })

  // ios with native Appium functions:
  // const browser = Appium.browser
  // const ele = await browser.$(elementSelector) // https://webdriver.io/docs/api/browser/$/
  // if (ele.error)
  //   throw new Error(`[e2e mobile: SelectorHelper] Could not find element with selector "${elementSelector}"`)
  // await ele.touchAction('tap')
}

export const fillFieldByTestId = async (testId: string, value: string) => {
  // await this.tapOnElementWithTestId(testId)
  // await Appium.type(value)

  const elementSelector = byTestId(testId)
  await waitForElement(elementSelector)
  await Appium.fillField(elementSelector, value)
}
