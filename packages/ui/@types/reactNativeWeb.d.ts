// https://github.com/paularmstrong/build-tracker/blob/371e54ebf37f935a7efd1240894cdc0a45acf7ac/typings/react-native/index.d.ts#L1578
import type { AccessibilityProps, ViewStyle as ReactViewStyle, Role } from 'react-native'

export type AccessibilityRoleWeb = Role | 'menuitemcheckbox' | 'menuitemradio'

interface AccessibilityPropsWeb extends AccessibilityProps {
  'aria-level'?: number
  role?: AccessibilityRoleWeb
  accessibilityPressed?: boolean
  'aria-controls'?: string
  'aria-haspopup'?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | true
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
}

// include web specific types (https://github.com/necolas/react-native-web/issues/1684)
declare module 'react-native' {
  interface PressableStateCallbackType {
    hovered?: boolean
    focused?: boolean
  }

  interface ViewStyle extends ReactViewStyle {
    display?: 'flex' | 'none' | 'inline-block'
    position?: 'relative' | 'fixed' | 'absolute'
    boxShadow?: string
    outlineWidth?: number
  }

  interface ViewProps extends ViewProps {
    role?: string
    'aria-labelledby'?: string | string[]
    accessibilityOrientation?: 'horizontal' | 'vertical'
    dataSet?: { [key: string]: string | number | boolean }
  }

  interface TextInputProps {
    autoComplete?: TextInputProps['autoComplete'] | 'current-password' // reference https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
  }

  interface TextStyle {
    display?: 'flex' | 'none' | 'inline-block'
    whiteSpace?:
      | 'normal'
      | 'nowrap'
      | 'pre'
      | 'pre-wrap'
      | 'pre-line'
      | 'break-spaces'
      | 'inherit'
      | 'initial'
      | 'revert'
      | 'revert-layer'
      | 'unset'
  }

  interface ImageStyle {
    display?: 'flex' | 'none' | 'inline-block'
  }
}
