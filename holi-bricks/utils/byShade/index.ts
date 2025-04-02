import type { Color, ColorPalette } from 'holi-bricks/foundations/colors/primitives'
import { palettes } from 'holi-bricks/tokens'

/**
 * Retrieves colors from a color palette by shade.
 *
 * This function takes a specific shade (e.g., '100', '200', etc.) and returns
 * an object that maps each color (e.g., 'red', 'blue') to the corresponding shade
 * from the provided palette.
 *
 * @param {keyof ColorPalette} shade - The shade to retrieve from the color palette.
 * @returns {Record<Color, string>} - A record where the key is the color name and the value is the corresponding shade.
 *
 * @example
 * // Example usage:
 * const shadeColors = byShade('200');
 *
 */
export const byShade = (shade: keyof ColorPalette): Record<Color, string> =>
  Object.entries(palettes).reduce(
    (previous, current) => {
      return { ...previous, ...{ [current[0]]: current[1][shade] } }
    },
    {} as Record<Color, string>
  )
