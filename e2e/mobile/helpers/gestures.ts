import type { RectReturn } from '@wdio/protocols/build/types'

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
 * horizontal swipes mimic a thumb moving slightly diagonally (y-values)
 */
const SCROLL_DIRECTIONS = {
  up: {
    start: { x: 50, y: 25 },
    end: { x: 50, y: 75 },
  },
  right: {
    start: { x: 85, y: 50 },
    end: { x: 15, y: 50 },
  },
  left: {
    start: { x: 15, y: 50 },
    end: { x: 85, y: 50 },
  },
  down: {
    start: { x: 50, y: 75 },
    end: { x: 50, y: 25 },
  },
}

export const scrollUp = async () => {
  swipe(SCROLL_DIRECTIONS.up)
}

export const scrollDown = async () => {
  swipe(SCROLL_DIRECTIONS.down)
}

export const scrollRight = async () => {
  swipe(SCROLL_DIRECTIONS.right)
}

export const scrollLeft = async () => {
  swipe(SCROLL_DIRECTIONS.left)
}

/**
 * Swipe from coordinates (start) to the new coordinates (end). The given coordinates are in percentages of the screen.
 */
const swipe = async (coord: { start: XY; end: XY }) => {
  const { start, end } = await convertToScreenCoordinates(coord)
  await doSwipe(start, end)
}

export const doSwipe = async (start: XY, end: XY) => {
  await Appium.performActions([
    {
      // a. Create the event
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        // b. Move finger into start position
        { type: 'pointerMove', duration: 0, x: start.x, y: start.y },
        // c. Finger comes down into contact with screen
        { type: 'pointerDown', button: 0 },
        // d. Pause for a little bit
        { type: 'pause', duration: 50 },
        // e. Finger moves to end position
        //    We move our finger from the center of the element to the
        //    starting position of the element.
        //    Play with the duration to make the swipe go slower / faster
        { type: 'pointerMove', duration: 500, x: end.x, y: end.y },
        { type: 'pause', duration: 50 },
        // f. Finger gets up, off the screen
        { type: 'pointerUp', button: 0 },
        // Add a pause to make sure the swipe is done
        { type: 'pause', duration: 500 },
      ],
    },
  ])
}

/**
 * Convert percentages of screen coordinates to absolute coordinates according to the screen size
 */
const convertToScreenCoordinates = async (coord: { start: XY; end: XY }) => {
  // Get the screen size and store it so it can be re-used.
  // This will save a lot of webdriver calls if this methods is used multiple times.
  SCREEN_SIZE = await getDeviceScreenSize()
  // Get the start position on the screen for the swipe
  const fromScreenCoordinates = getDeviceScreenCoordinates(SCREEN_SIZE, coord.start)
  // Get the move to position on the screen for the swipe
  const toScreenCoordinates = getDeviceScreenCoordinates(SCREEN_SIZE, coord.end)

  return { start: fromScreenCoordinates, end: toScreenCoordinates }
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

export const getDeviceScreenSize = async () => {
  return SCREEN_SIZE || (await Appium.getWindowRect())
}

export const performPullToRefresh = async () => {
  const { width: screenWidth, height: screenHeight } = await getDeviceScreenSize()

  const midX = screenWidth / 2
  const topY = 0.25 * screenHeight
  const bottomY = 0.75 * screenHeight

  await Appium.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: midX, y: topY },
        { type: 'pointerDown' },
        { type: 'pause', duration: 500 },
        { type: 'pointerMove', duration: 100, x: midX, y: bottomY },
        { type: 'pause', duration: 1000 },
        { type: 'pointerUp' },
      ],
    },
  ])
}
