// Import the global theme augmentation from holi-bricks (single source of truth)
import type { LightTheme } from 'holi-bricks/foundations/colors/themes/types'
import type { BreakpointsSize } from 'holi-bricks/foundations/dimensions/breakpoints'

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends BreakpointsSize {}
  export interface UnistylesThemes {
    light: LightTheme
    // dark: DarkTheme // Uncomment when HOLI-11770 is completed
  }
}

export {}
