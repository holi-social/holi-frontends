import colors from './colors'
import rawDimensions from './dimensions'
import fonts from './fonts'

const dimensions = Object.entries(rawDimensions).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: +value as number,
  }),
  {} as { [key in keyof typeof rawDimensions]: number }
)

// TODO: colors will be used only based off the theme, not as a static file
export { dimensions, colors, fonts }
