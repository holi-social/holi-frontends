type ScrollDirection = 'up' | 'down' | 'left' | 'right'

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
  direction: ScrollDirection,
  {
    timeout = 1000,
    maxAttempts = 5,
    repetitions,
  }: { timeout?: number; maxAttempts?: number; repetitions?: number } = {}
) => {
  let scrollCounter = 0
  const implicitTimeout = Appium.options.waitforTimeout
  await Appium.setImplicitTimeout(timeout)
  while (scrollCounter < maxAttempts) {
    // is the element in the viewport?
    try {
      const elem = await waitForElementWithTestId(testId, 1)
      // reset the timeout before exiting the function
      await Appium.setImplicitTimeout(implicitTimeout)
      return elem
    } catch (e) {
      //console.log(
      //  `${new Date().getTime()}: element with testID ${testId} not found after scrolling ${scrollCounter}/${maxAttempts} times `
      //)
    }
    // On Android, a scrollToElement only works when it is lower on the page
    // hypothesis: scrolling up starts in the header area and the header suppresses the scroll
    // Therefore, we do scrolling via finger actions
    // Luckily, this also works on iOS
    await scroll(direction, { repetitions })
    scrollCounter++
  }
  await Appium.setImplicitTimeout(implicitTimeout)
  // last try
  return await waitForElementWithTestId(testId, 1)
}

export const scroll = async (direction: ScrollDirection, { repetitions = 1 }: { repetitions?: number } = {}) => {
  const isVertical = ['up', 'down'].includes(direction)
  const isReverse = ['down', 'right'].includes(direction)

  const { width, height } = await Appium.getWindowSize()

  const vectorX = isVertical ? calculateCrossAxisScrollVector(width) : calculateScrollVector(width, isReverse)
  const vectorY = isVertical ? calculateScrollVector(height, isReverse) : calculateCrossAxisScrollVector(height)

  for (let rep = 0; rep < repetitions; rep++) {
    await Appium.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          {
            type: 'pointerMove',
            duration: 0,
            x: vectorX.start,
            y: vectorY.start,
          },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          {
            type: 'pointerMove',
            duration: 200,
            origin: 'pointer',
            x: vectorX.length,
            y: vectorY.length,
          },
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: repetitions > 1 ? 500 : 100 },
        ],
      },
    ])
  }
}

type ScrollVector = {
  start: number
  length: number
}

const calculateScrollVector = (axisLength: number, isReverse: boolean): ScrollVector => {
  const upperPercentage = 25 // hypothesis: if this is too small, scroll up does not work because scroll movement starts in the header area
  const lowerPercentage = 75

  const upperPoint = (axisLength * upperPercentage) / 100
  const lowerPoint = (axisLength * lowerPercentage) / 100
  const startPoint = isReverse ? lowerPoint : upperPoint
  // y-value is platform dependent, empirically measured by watching videos of the scroll behaviour on browserstack
  // The way it's set up here both platforms scroll almost a full page.
  const movementAndroid = isReverse ? upperPoint - lowerPoint : lowerPoint - upperPoint
  const movementIOS = movementAndroid / 4
  const movement = platform === 'ios' ? movementIOS : movementAndroid
  return {
    start: startPoint,
    length: movement,
  }
}

const calculateCrossAxisScrollVector = (crossAxisLength: number): ScrollVector => {
  const anchorPercentage = 50
  const crossAxisAnchor = (crossAxisLength * anchorPercentage) / 100
  return {
    start: crossAxisAnchor,
    length: 0,
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
