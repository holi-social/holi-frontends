import { RectReturn } from '@wdio/protocols/build/types'

/**
 * To make a Gesture methods more robust for multiple devices and also
 * multiple screen sizes the advice is to work with percentages instead of
 * actual coordinates. The percentages will calculate the position on the
 * screen based on the SCREEN_SIZE which will be determined once if needed
 * multiple times.
 *
 * Helper methods taken from https://github.com/webdriverio/appium-boilerplate/blob/9c422b494851420c44cc50d8b99b7a73a5b2acf1/tests/helpers/Gestures.ts
 */

let SCREEN_SIZE: RectReturn
interface XY {
  x: number
  y: number
}

/**
 * The values in the below object are percentages of the screen
 */
const SWIPE_DIRECTION = {
  down: {
    start: { x: 50, y: 15 },
    end: { x: 50, y: 85 },
  },
  left: {
    start: { x: 95, y: 50 },
    end: { x: 5, y: 50 },
  },
  right: {
    start: { x: 5, y: 50 },
    end: { x: 95, y: 50 },
  },
  up: {
    start: { x: 50, y: 85 },
    end: { x: 50, y: 15 },
  },
}

/**
 * Swipe down based on a percentage
 */
export const swipeDown = async (percentage = 1) => {
  await swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.down.start, percentage),
    calculateXY(SWIPE_DIRECTION.down.end, percentage)
  )
}

/**
 * Swipe Up based on a percentage
 */
export const swipeUp = async (percentage = 1) => {
  await swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.up.start, percentage),
    calculateXY(SWIPE_DIRECTION.up.end, percentage)
  )
}

/**
 * Swipe left based on a percentage
 */
export const swipeLeft = async (percentage = 1) => {
  await swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.left.start, percentage),
    calculateXY(SWIPE_DIRECTION.left.end, percentage)
  )
}

/**
 * Swipe right based on a percentage
 */
export const swipeRight = async (percentage = 1) => {
  await swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.right.start, percentage),
    calculateXY(SWIPE_DIRECTION.right.end, percentage)
  )
}

/**
 * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
 * percentages of the screen.
 */
const swipeOnPercentage = async (from: XY, to: XY) => {
  // Get the screen size and store it so it can be re-used.
  // This will save a lot of webdriver calls if this methods is used multiple times.
  SCREEN_SIZE = SCREEN_SIZE || (await Appium.getWindowRect())
  // Get the start position on the screen for the swipe
  const pressOptions = getDeviceScreenCoordinates(SCREEN_SIZE, from)
  // Get the move to position on the screen for the swipe
  const moveToScreenCoordinates = getDeviceScreenCoordinates(SCREEN_SIZE, to)

  await swipe(pressOptions, moveToScreenCoordinates)
}

/**
 * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
 */
const swipe = async (from: XY, to: XY) => {
  await Appium.performActions([
    {
      // a. Create the event
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        // b. Move finger into start position
        { type: 'pointerMove', duration: 0, x: from.x, y: from.y },
        // c. Finger comes down into contact with screen
        { type: 'pointerDown', button: 0 },
        // d. Pause for a little bit
        { type: 'pause', duration: 100 },
        // e. Finger moves to end position
        //    We move our finger from the center of the element to the
        //    starting position of the element.
        //    Play with the duration to make the swipe go slower / faster
        { type: 'pointerMove', duration: 1000, x: to.x, y: to.y },
        // f. Finger gets up, off the screen
        { type: 'pointerUp', button: 0 },
      ],
    },
  ])
  // Add a pause, just to make sure the swipe is done
  await Appium.pause(1000)
}

/**
 * Get the screen coordinates based on a device his screen size
 */
const getDeviceScreenCoordinates = (screenSize: RectReturn, coordinates: XY): XY => {
  return {
    x: Math.round(screenSize.width * (coordinates.x / 100)),
    y: Math.round(screenSize.height * (coordinates.y / 100)),
  }
}

/**
 * Calculate the x y coordinates based on a percentage
 */
const calculateXY = ({ x, y }: XY, percentage: number): XY => {
  return {
    x: x * percentage,
    y: y * percentage,
  }
}
