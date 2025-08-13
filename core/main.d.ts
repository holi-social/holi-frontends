import type { Themes } from 'holi-bricks/foundations/colors/themes/types'
import type { BreakpointsSize } from 'holi-bricks/foundations/dimensions/breakpoints'

declare module 'react-native-unistyles' {
  // eslint-disable-next-line
  export interface UnistylesBreakpoints extends BreakpointsSize {}
  // eslint-disable-next-line
  export interface UnistylesThemes extends Themes {}
}
