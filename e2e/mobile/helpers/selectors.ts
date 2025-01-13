import type { Element, ElementArray } from 'webdriverio'

import {
  doSwipe,
  getDeviceScreenSize,
  performPullToRefresh,
  scrollDown,
  scrollLeft,
  scrollRight,
  scrollUp,
} from './gestures'
import { delayMs } from './time'

type ScrollDirection = 'up' | 'down' | 'left' | 'right'

// https://webdriver.io/docs/selectors
const byTestId = (testID: string) => (platform === 'ios' ? `~${testID}` : `android=resourceId("${testID}")`)

// https://webdriver.io/docs/selectors/#xpath
const byText = (text: string) => (platform === 'ios' ? `//*[@name="${text}"]` : `//*[@text="${text}"]`)

const elementBySelector = async (elementSelector: string): Promise<Element<'async'>> => await Appium.$(elementSelector)

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
  // @ts-ignores
  Appium.options.currentImplicitTimeout = timeout
  await Appium.setImplicitTimeout(timeout)
}

export const resetImplicitTimeout = async () => {
  // @ts-ignore
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

export interface FoundElementPair {
  element: Element<'async'>
  testId: string
}

export const waitForAnyElementWithTestId = async (testIds: string[], timeout = 10): Promise<FoundElementPair> => {
  // https://webdriver.io/docs/api/browser/$
  return withImplicitTimeout(timeout, async () => {
    let foundElement: FoundElementPair | undefined = undefined
    let count = 0
    // @ts-ignore
    const max = Appium.options.waitforTimeout / 500
    while (!foundElement && count < max) {
      const foundAll = await Promise.all(testIds.map(async (testId) => elementByTestId(testId)))
      const pairs = foundAll.map((e, index) => ({ element: e, testId: testIds[index] }))
      foundElement = pairs.find((p) => p.element.elementId !== undefined)
      count++
      if (foundElement) {
        try {
          await foundElement.element.waitForDisplayed({ timeout: 3000 })
          return foundElement
        } catch (err) {
          // waitForDisplayed threw an error, so the element is not displayed, so we retry
        }
      } else {
        await delayMs(500)
      }
    }
    throw new Error('None of these elements were found: ' + testIds)
  })
}

const scrollElementIntoView = async (testId: string, direction: ScrollDirection, maxAttempts: number) => {
  let scrollCounter = 0
  while (scrollCounter < maxAttempts) {
    // is the element in the viewport?
    try {
      // Not explicitly awaiting the element caused a second scroll to happen too soon, possibly overscrolling the element to search for
      const element = await waitForElementWithTestId(testId, 100)
      return element
    } catch (e) {
      // element was not found
    }

    switch (direction) {
      case 'up':
        await scrollUp()
        break
      case 'down':
        await scrollDown()
        break
      case 'left':
        await scrollLeft()
        break
      case 'right':
        await scrollRight()
        break
    }

    scrollCounter++
  }
  // one last try after the final scroll
  return await waitForElementWithTestId(testId)
}

/**
 * during up or down scroll, ensure the element is within the middle 50% of the screen and not in the upper or lower 25%, to ensure it's touchable
 */
const scrollElementToCenter = async (element: Element<'async'>, direction: ScrollDirection) => {
  const { width: screenWidth, height: screenHeight } = await getDeviceScreenSize()
  const { y, height } = await getElementCoordinates(element)
  if (direction === 'up' || direction === 'down') {
    const viewStartY = screenHeight / 4
    const viewEndY = viewStartY * 3
    const viewMiddleX = screenWidth / 2
    if (y + height > viewEndY) {
      // element is in the lowest 25% of the screen: scroll up
      const scrollPixel = Math.max(y + height - viewEndY, 50) // scroll at least 50 pixels, so it will not be interpreted as a tap
      await doSwipe({ x: viewMiddleX, y: viewEndY }, { x: viewMiddleX, y: viewEndY - scrollPixel })
    } else if (y < viewStartY) {
      // element is in the highest 25% of the screen: scroll down
      const scrollPixel = Math.max(viewStartY - y, 50) // scroll at least 50 pixels, so it will not be interpreted as a tap
      await doSwipe({ x: viewMiddleX, y: viewStartY }, { x: viewMiddleX, y: viewStartY + scrollPixel })
    }
  }
}

export const scrollToElementWithTestId = async (
  testId: string,
  direction: ScrollDirection,
  { timeout = 1000, maxAttempts = 12 }: { timeout?: number; maxAttempts?: number } = {}
) => {
  return withImplicitTimeout(timeout, async () => {
    const element = await scrollElementIntoView(testId, direction, maxAttempts)
    await scrollElementToCenter(element, direction)
    return element
  })
}

const locateMultipleElements = async (elementSelector: string): Promise<ElementArray> => {
  // https://webdriver.io/docs/api/browser/$$
  return await Appium.$$(elementSelector)
}

export const locateMultipleElementsWithTestId = async (testId: string) => locateMultipleElements(byTestId(testId))

export const locateElementsByRoleAndCheckedState = async (role: string, checked: boolean): Promise<ElementArray> => {
  if (checked) {
    return await Appium.$$(`[role="${role}"]:checked`)
  } else {
    return await Appium.$$(`[role="${role}"]:not(:checked)`)
  }
}

export const seeTextWithTestId = async (expectedText: string, testId: string, timeout?: number) => {
  const element = await waitForElementWithTestId(testId, timeout)
  // https://webdriver.io/docs/api/element/getText
  const text = await element.getText()
  expect(text).toMatch(expectedText)
}

export const tapOnElement = async (element: Element<'async'>) => {
  // https://webdriver.io/docs/api/element/touchAction
  try {
    await Appium.touchAction({ element, action: 'tap' })
  } catch (err) {
    throw new Error(`Couldn't tap on element: ${element}`)
  }
}

export const tapOnElementWithTestId = async (testId: string, timeout?: number) => {
  // https://webdriver.io/docs/api/element/touchAction
  try {
    const element = await waitForElementWithTestId(testId, timeout)
    await tapOnElement(element)
    return element
  } catch (err) {
    throw new Error("Couldn't tap on element with testID: " + testId)
  }
}

export const tapOnLoginLinkInText = async (selector = 'already-have-account-text') => {
  const element = await waitForElementWithTestId(selector)
  const { x, y, width, height } = await getElementCoordinates(element)

  await Appium.touchAction({ action: 'tap', x: x + width - 20, y: y + height / 2 })
}

export const getElementCoordinates = async (element: Element<'async'>) => {
  const { x, y } = (await element.getLocation()) as { x: number; y: number }
  const { width, height } = (await element.getSize()) as { width: number; height: number }
  return { x, y, width, height }
}

export const fillFieldByTestId = async (testId: string, value: string) => {
  try {
    const element = await tapOnElementWithTestId(testId)
    // https://webdriver.io/docs/api/element/setValue
    await element.clearValue()
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

export const retry = async (fn: () => Promise<void>, timeout = 3000, retryIntervall = 200) => {
  const startTime = Date.now()

  const poll = async (): Promise<void> => {
    try {
      await fn()
      // eslint-disable-next-line no-console
      console.log('Fulfilled')
      return
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Retrying...')
      if (Date.now() - startTime >= timeout) {
        throw new Error('Condition was not met within the timeout')
      }

      await new Promise((resolve) => setTimeout(resolve, retryIntervall)) // Wait for the interval before retrying
      return poll() // Retry
    }
  }

  return poll() // Start polling
}

export const pullToRefresh = async (timeout?: number) => {
  await performPullToRefresh()

  // Expect refresh indicator to be displayed for a while
  await waitForElementWithTestId('refreshing')
  await waitForElementWithTestId('not-refreshing', timeout)
}
