// https://webdriver.io/docs/selectors
const byTestId = (testID: string) => (platform === 'ios' ? `~${testID}` : `//*[@resource-id='${testID}']`)

const waitForElement = async (elementSelector: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(elementSelector)

  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout })

  return element
}

const locateMultipleElements = async (elementSelector: string) => {
  // https://webdriver.io/docs/api/browser/$$
  const elements = await Appium.$$(elementSelector)

  return elements
}

export const waitForElementWithTestIdToBeNull = async (testId: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(byTestId(testId))

  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout, reverse: true })

  return element
}

export const scrollToElementWithTestId = async (
  testId: string,
  direction: 'up' | 'down',
  { timeout, maxAttempts = 1 }: { timeout?: number; maxAttempts?: number }
) => {
  // scrollIntoView is not supported for iOS and webdriverio currently requires a manual scroll down, instead of a scroll into element
  // https://github.com/webdriverio/webdriverio/issues/6537 and https://stackoverflow.com/questions/42656872/how-to-do-scroll-on-ios-native-app-with-webdriver-io
  if (platform === 'ios') {
    let scrollCounter = 0
    while (scrollCounter < maxAttempts) {
      scrollCounter++
      try {
        await Appium.execute('mobile: scroll', { direction })

        const element = await Appium.$(byTestId(testId))

        await element.waitForDisplayed({ timeout })

        return element
      } catch (e) {
        // element not visible yet, throw if max attempt count reached
        if (scrollCounter === maxAttempts) {
          throw e
        }
      }
    }
  }

  // See https://developer.android.com/reference/androidx/test/uiautomator/UiScrollable +
  // https://developer.android.com/reference/androidx/test/uiautomator/UiSelector
  const selector = `android=new UiScrollable(new UiSelector().scrollable(true).instance(0)).scrollIntoView(new UiSelector().resourceId("${testId}"))`

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

export const locateMultipleElementsWithTestId = async (testId: string) => locateMultipleElements(byTestId(testId))

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
    throw new Error("Couldn't tap on element with testID: " + testId)
  }
}

export const fillFieldByTestId = async (testId: string, value: string) => {
  try {
    const element = await tapOnElementWithTestId(testId)
    // https://webdriver.io/docs/api/element/setValue
    await element.setValue(value)
  } catch (err) {
    throw new Error("Couldn't fill field with testID: " + testId)
  }
}
