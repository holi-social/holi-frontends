import { breakpoints, type BreakpointsSize } from 'holi-bricks/foundations'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import type { Themes } from 'holi-bricks/foundations/colors/themes/types'
import { StyleSheet } from 'react-native-unistyles'

type Options = Record<string, unknown> & {
  isProduction: boolean
}

export let config: Options = {
  isProduction: false,
}

declare module 'react-native-unistyles' {
  // eslint-disable-next-line
  export interface UnistylesBreakpoints extends BreakpointsSize {}
  // eslint-disable-next-line
  export interface UnistylesThemes extends Themes {}
}

export const initializeBricks = (options?: Partial<Options>) => {
  config = { ...config, ...options }

  StyleSheet.configure({
    settings: {
      initialTheme: 'light',
    },
    themes: {
      light: lightTheme,
      // Removing dark theme until fully supported with HOLI-11770
      // dark: darkTheme,
    },
    breakpoints: {
      ...{ zero: 0 },
      ...breakpoints,
    },
  })
}
