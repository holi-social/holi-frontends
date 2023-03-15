import { scrollDown, scrollLeft, scrollRight, scrollUp } from './gestures'
import { delay } from './time'

type ScrollDirection = 'up' | 'down' | 'left' | 'right'

// https://webdriver.io/docs/selectors
const byTestId = (testID: string) => (platform === 'ios' ? `~${testID}` : `//*[@resource-id='${testID}']`)

const byText = (text: string) => `*${text}`

const elementBySelector = async (elementSelector: string) => await Appium.$(elementSelector)

export const elementByTestId = async (testId: string) => await elementBySelector(byTestId(testId))

const waitForElement = async (elementSelector: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await elementBySelector(elementSelector)

  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout })

  return element
}

export const waitForElementWithInnerText = async (text: string, timeout?: number) =>
  waitForElement(byText(text), timeout)

export const waitForElementWithTestId = async (testId: string, timeout?: number) =>
  waitForElement(byTestId(testId), timeout)

export const waitForElementWithTestIdToBeNull = async (testId: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await elementByTestId(testId)

  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout, reverse: true })

  return element
}

export const setImplicitTimeout = async (timeout: number) => {
  Appium.options.currentImplicitTimeout = timeout
  await Appium.setImplicitTimeout(timeout)
}

export const resetImplicitTimeout = async () => {
  await setImplicitTimeout(Appium.options.waitforTimeout)
}

export const withImplicitTimeout = async <T>(timeout: number, fn: () => Promise<T>) => {
  await setImplicitTimeout(timeout)
  try {
    return await fn()
  } finally {
    await resetImplicitTimeout()
  }
}

export const checkIfElementWithTestIdExists = async (testId: string, timeout = 10) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await withImplicitTimeout(timeout, async () => await elementByTestId(testId))
  return element.elementId !== undefined
}

export const waitForAnyElementWithTestId = async (testIds: string[], timeout = 10) => {
  // https://webdriver.io/docs/api/browser/$
  return withImplicitTimeout(timeout, async () => {
    let found = false
    let count = 0
    const max = Appium.options.waitforTimeout / 1000
    while (!found && count < max) {
      const foundAll = await Promise.all(
        testIds.map(async (testId): Promise<boolean> => (await elementByTestId(testId)).elementId !== undefined)
      )
      found = foundAll.some((e) => e)
      count++
      if (!found) {
        await delay(1)
      }
    }
    return found
  })
}

export const scrollToElementWithTestId = async (
  testId: string,
  direction: ScrollDirection,
  { timeout = 1000, maxAttempts = 7 }: { timeout?: number; maxAttempts?: number } = {}
) => {
  let scrollCounter = 0
  return withImplicitTimeout(timeout, async () => {
    while (scrollCounter < maxAttempts) {
      // if (await checkIfElementWithTestIdExists(testId, 500)) {
      //   return
      // }

      // is the element in the viewport?
      try {
        return await waitForElementWithTestId(testId, 100)
      } catch (e) {
        // element was not found
      }

      /**
       * Swiping works in opposite direction to scrolling (swiping left means scrolling right).
       * Hence the inverted directions below.
       */
      switch (direction) {
        case 'down':
          scrollDown()
          break
        case 'up':
          scrollUp()
          break
        case 'left':
          scrollLeft()
          break
        case 'right':
          scrollRight()
      }

      scrollCounter++
    }
    // one last try
    return await waitForElementWithTestId(testId, 1000)
  })
}

const locateMultipleElements = async (elementSelector: string): Promise<Record<string, unknown>[]> => {
  // https://webdriver.io/docs/api/browser/$$
  return await Appium.$$(elementSelector)
}

export const locateMultipleElementsWithTestId = async (testId: string): Promise<Record<string, unknown>[]> =>
  locateMultipleElements(byTestId(testId))

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
    return element
  } catch (err) {
    throw new Error("Couldn't fill field with testID: " + testId)
  }
}

export const pressEnter = async (inputTestId: string) => {
  // Found here: https://discuss.appium.io/t/how-to-click-enter-after-entering-some-text/3136/21
  // On iOS we submit text input by sending the "newline" key to the input element,
  // while on Android we submit by sending the key code for "Enter"
  if (platform === 'ios') {
    const inputElement = await waitForElementWithTestId(inputTestId)
    // https://appium.io/docs/en/commands/element/actions/send-keys/index.html
    await inputElement.sendKeys(['\n'])
  } else {
    // https://appium.io/docs/en/commands/device/keys/press-keycode/
    // 66 is KeyCode for "Enter"
    await Appium.pressKeyCode(66)
  }
}
