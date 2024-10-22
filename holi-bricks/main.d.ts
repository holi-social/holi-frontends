import type { darkTheme } from 'holi-bricks/themes/dark'
import type { lightTheme } from 'holi-bricks/themes/light'
import type breakpoints from 'holi-bricks/tokens/foundations/dimensions/breakpoints'

type Breakpoints = typeof breakpoints & {
  readonly zero: 0
}

declare global {
  type AvailableThemes = 'light' | 'dark'
}

type Themes = {
  light: typeof lightTheme
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface UnistylesBreakpoints extends Breakpoints {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface UnistylesThemes extends Themes {}
}
