import type { BreakpointsSize } from 'holi-bricks/foundations'
import type { Themes } from 'holi-bricks/foundations/colors/themes/types'
import 'holi-bricks/main.d.ts'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: any
  }
}

export declare module 'react-native-unistyles' {
  // eslint-disable-next-line
  export interface UnistylesBreakpoints extends BreakpointsSize {}
  // eslint-disable-next-line
  export interface UnistylesThemes extends Themes {}
}
