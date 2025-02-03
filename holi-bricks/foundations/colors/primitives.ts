export type ColorPalette = {
  '300': string
  '400': string
  '600': string
  '700': string
  '800': string
}

export type ExtendedColorPalette = ColorPalette & {
  '100': string
  '200': string
  '500': string
}

export const mono = {
  '100': '#ffffff',
  '200': '#f5f5f5',
  '300': '#ebebeb',
  '400': '#bdbcbc',
  '500': '#8a8989',
  '600': '#676565',
  '700': '#3d3c3c',
  '800': '#262424',
} as const

export const white = mono['100']
export const black = mono['800']

export const yellow = {
  '300': '#ffffd1',
  '400': '#fdfd80',
  '600': '#c4bd5f',
  '700': '#615d24',
  '800': '#3d3d1b',
} as const

export const purple = {
  '300': '#ebecff',
  '400': '#8b95ff',
  '600': '#5b60d6',
  '700': '#4c5194',
  '800': '#33386b',
} as const

export const green = {
  '300': '#d6ffc7',
  '400': '#abff8b',
  '600': '#82d952',
  '700': '#3c7a1a',
  '800': '#255a08',
} as const

export const blue = {
  '300': '#d9f4ff',
  '400': '#90ddff',
  '600': '#45b2e0',
  '700': '#157199',
  '800': '#01567a',
} as const

export const orange = {
  '300': '#ffedd6',
  '400': '#ffc046',
  '600': '#ec9d04',
  '700': '#a87002',
  '800': '#805400',
} as const

export const red = {
  '300': '#ffebec',
  '400': '#ff6469',
  '600': '#cc1820',
  '700': '#a60a11',
  '800': '#8f0007',
} as const

export enum Colors {
  mono = 'mono',
  yellow = 'yellow',
  purple = 'purple',
  green = 'green',
  blue = 'blue',
  orange = 'orange',
  red = 'red',
}

export type Color = keyof typeof Colors
export type ColorExtended = Color | 'black' | 'white'

type Palettes = Record<Color, ColorPalette>

export const palettes: Palettes = {
  mono,
  yellow,
  purple,
  green,
  blue,
  orange,
  red,
}

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
