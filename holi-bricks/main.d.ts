import type { darkTheme } from 'holi-bricks/foundations/colors/themes/dark'
import type { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import type { BreakpointsSize } from 'holi-bricks/foundations/dimensions/breakpoints'
import type { Role } from 'react-native'
import type { AccessibilityProps } from 'react-native'

type AccessibilityRoleWeb = Role | 'menuitemcheckbox' | 'menuitemradio'

declare global {
  type AvailableThemes = 'light' | 'dark'
  // RN WEB
  interface AccessibilityPropsWeb extends AccessibilityProps {
    'aria-level'?: number
    role?: AccessibilityRoleWeb
    accessibilityPressed?: boolean
    'aria-controls'?: string
    'aria-haspopup'?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | true
    'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
  }
}

type Themes = {
  light: typeof lightTheme
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  // eslint-disable-next-line
  export interface UnistylesBreakpoints extends BreakpointsSize {}
  // eslint-disable-next-line
  export interface UnistylesThemes extends Themes {}
}
