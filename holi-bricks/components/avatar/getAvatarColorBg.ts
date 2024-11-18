import type { ColorValue } from 'react-native'

/**

 * @description
 * Generates a background color for an avatar based on the provided initials.
 * This function takes a set of colors and a string of initials, then computes a hash
 * value based on the provided initials then it returns a consistent color from the provided set.
 * This ensures that the avatar color will always be the same for a given set of initials.
 *
 * @param colors - An array of color values to choose from.
 * @param {string} initials - The initials for which the color background will be generated.
 * @returns {ColorValue} - A color value selected from the provided colors.
 *
 * @example
 * const colors = ['#FF5733', '#33FF57', '#3357FF'];
 * const initials = 'JD';
 * const bgColor = getAvatarColorBg(colors, initials);
 * getAvatarColorBg will be one of the values from the colors array, consistently based on the initials.
 */
export const getAvatarColorBg = (colors: string[], initials: string): ColorValue => {
  if (!colors?.length) throw "Colors can't be empty"
  let hash = 0
  for (let i = 0; i < initials?.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % colors.length

  return colors[index || 0]
}
