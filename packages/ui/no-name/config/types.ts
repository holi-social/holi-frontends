/* eslint-disable @typescript-eslint/no-empty-interface */
import darkTheme from '@holi/ui/no-name/foundations/colors/themes/dark'
import lightTheme from '@holi/ui/no-name/foundations/colors/themes/light'
import breakpoints from '@holi/ui/no-name/foundations/dimensions/breakpoints'

type Breakpoints = typeof breakpoints & {
  readonly zero: 0
}

type Themes = {
  light: typeof lightTheme
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends Breakpoints {}
  export interface UnistylesThemes extends Themes {}
}
