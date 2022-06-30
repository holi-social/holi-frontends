// https://github.com/paularmstrong/build-tracker/blob/371e54ebf37f935a7efd1240894cdc0a45acf7ac/typings/react-native/index.d.ts#L1578
import type { AccessibilityProps, AccessibilityRole } from 'react-native'

export type AccessibilityRoleWeb = AccessibilityRole | 'main' | 'region' | 'banner'

interface AccessibilityPropsWeb extends AccessibilityProps {
  accessibilityLevel?: number
  accessibilityRole?: AccessibilityRoleWeb
}

// include web specific types (https://github.com/necolas/react-native-web/issues/1684)
declare module 'react-native' {
  interface PressableStateCallbackType {
    hovered?: boolean
    focused?: boolean
  }

  interface ViewStyle {
    display?: 'flex' | 'none' | 'inline-block' | undefined
    boxShadow?: string | undefined
  }

  interface ViewProps extends ViewProps {
    accessibilityRole?: string
  }

  interface TextStyle {
    display?: 'flex' | 'none' | 'inline-block' | undefined
  }
  interface ImgageStyle {
    display?: 'flex' | 'none' | 'inline-block' | undefined
  }
}
