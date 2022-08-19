// https://github.com/paularmstrong/build-tracker/blob/371e54ebf37f935a7efd1240894cdc0a45acf7ac/typings/react-native/index.d.ts#L1578
import type { AccessibilityProps, AccessibilityRole, ViewStyle as ReactViewStyle } from 'react-native'

export type AccessibilityRoleWeb = AccessibilityRole | 'main' | 'region' | 'banner' | 'navigation' | 'heading'

interface AccessibilityPropsWeb extends AccessibilityProps {
  accessibilityLevel?: number
  accessibilityRole?: AccessibilityRoleWeb
  accessibilityPressed?: boolean
  accessibilityAutoComplete?: 'none' | 'inline' | 'list' | 'both'
}

// include web specific types (https://github.com/necolas/react-native-web/issues/1684)
declare module 'react-native' {
  interface PressableStateCallbackType {
    hovered?: boolean
    focused?: boolean
  }

  interface ViewStyle extends ReactViewStyle {
    display?: 'flex' | 'none' | 'inline-block' | undefined
    boxShadow?: string | undefined
  }

  interface ViewProps extends ViewProps {
    accessibilityRole?: string
    accessibilityOrientation?: 'horizontal' | 'vertical'
  }

  interface TextInputProps {
    autoComplete?: TextInputProps['autoComplete'] | 'current-password' // reference https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
  }

  interface TextStyle {
    display?: 'flex' | 'none' | 'inline-block' | undefined
  }
  interface ImageStyle {
    display?: 'flex' | 'none' | 'inline-block' | undefined
  }
}
