import type { Role } from 'react-native'
import type { AccessibilityProps } from 'react-native'

import type { Themes } from './foundations/colors/themes/types'
import type { BreakpointsSize } from './foundations/dimensions/breakpoints'

type AccessibilityRoleWeb = Role | 'menuitemcheckbox' | 'menuitemradio'

export declare global {
  // Removing the dark theme until fully supported with HOLI-11770
  type AvailableThemes = 'light' // | 'dark'
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

export declare module 'react-native-unistyles' {
  // eslint-disable-next-line
  export interface UnistylesBreakpoints extends BreakpointsSize {}
  // eslint-disable-next-line
  export interface UnistylesThemes extends Themes {}
}
