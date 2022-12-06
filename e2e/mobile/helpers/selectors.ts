// https://webdriver.io/docs/selectors
const byTestId = (testID: string) => (platform === 'ios' ? `~${testID}` : `//*[@resource-id='${testID}']`)

const byText = (text: string) => `*${text}`

const waitForElement = async (elementSelector: string, timeout?: number) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(elementSelector)

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
  const element = await Appium.$(byTestId(testId))

  // https://webdriver.io/docs/api/element/waitForDisplayed
  await element.waitForDisplayed({ timeout, reverse: true })

  return element
}

export const checkIfElementWithTestIdExists = async (testId: string) => {
  // https://webdriver.io/docs/api/browser/$
  const element = await Appium.$(byTestId(testId))

  // https://webdriver.io/docs/api/element/isExisting
  return element.isExisting()
}

export const scrollToElementWithTestId = async (
  testId: string,
  direction: 'up' | 'down',
  { timeout = 1000, maxAttempts = 1 }: { timeout?: number; maxAttempts?: number } = {}
) => {
  let scrollCounter = 0
  const implicitTimeout = Appium.options.waitforTimeout
  await Appium.setImplicitTimeout(timeout)
  while (scrollCounter < maxAttempts) {
    // is the element in the viewport?
    if (await checkIfElementWithTestIdExists(testId)) {
      await Appium.setImplicitTimeout(implicitTimeout)
      return await waitForElementWithTestId(testId, 1)
    } else {
      console.log(
        `${new Date().getTime()}: element with testID ${testId} not found after scrolling ${scrollCounter}/${maxAttempts} times `
      )
    }
    if (platform === 'ios') {
      // scrollIntoView is not supported for iOS and webdriverio currently requires a manual scroll down, instead of a scroll into element
      // https://github.com/webdriverio/webdriverio/issues/6537 and https://stackoverflow.com/questions/42656872/how-to-do-scroll-on-ios-native-app-with-webdriver-io
      await Appium.execute('mobile: scroll', { direction: direction })
    } else {
      // On Android, a scrollToElement only works when it is lower on the page
      // hypothesis: scrolling up starts in the header area and the header suppresses the scroll
      // Therefore, we do scrolling via finger actions
      await scroll(direction)
    }
    scrollCounter++
  }
  await Appium.setImplicitTimeout(implicitTimeout)
  // last try
  return await waitForElementWithTestId(testId, 1)
}

export const scroll = async (
  direction: 'up' | 'down',
  { scrollDuration = 150, repetitions = 1 }: { scrollDuration?: number; repetitions?: number } = {}
) => {
  const upperPercentage = 20 // hypothesis: if this is too small, scroll up does not work because scroll movement starts in the header area
  const lowerPercentage = 80
  const anchorPercentage = 50

  const { width, height } = await Appium.getWindowSize()
  // might be needed for some devices (retina style displays?), leaving it as a reference.
  //const density = (await driver.getDisplayDensity()) / 100
  const anchor = (width * anchorPercentage) / 100
  const upperPoint = (height * upperPercentage) / 100
  const lowerPoint = (height * lowerPercentage) / 100
  const startPoint = direction == 'down' ? lowerPoint : upperPoint
  const movementY = direction == 'down' ? upperPoint - lowerPoint : lowerPoint - upperPoint

  for (let rep = 0; rep < repetitions; rep++) {
    await Appium.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: anchor, y: startPoint },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: scrollDuration, origin: 'pointer', x: 0, y: movementY },
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: 100 },
        ],
      },
    ])
  }
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
