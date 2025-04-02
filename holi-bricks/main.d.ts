import type breakpoints from 'holi-bricks/foundations/dimensions/breakpoints'
import type { darkTheme } from 'holi-bricks/themes/dark'
import type { lightTheme } from 'holi-bricks/themes/light'
import type { Role } from 'react-native'

type Breakpoints = typeof breakpoints & {
  readonly zero: 0
}

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

  type BgColors = 'container' | 'page' | 'selected' | 'disabled'
  type BorderColors = 'main' | 'support' | 'default' | 'quaternary'
}

type Themes = {
  light: typeof lightTheme
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends Breakpoints {} // eslint-disable-line
  export interface UnistylesThemes extends Themes {} // eslint-disable-line
}
