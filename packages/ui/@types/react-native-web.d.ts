// https://github.com/paularmstrong/build-tracker/blob/371e54ebf37f935a7efd1240894cdc0a45acf7ac/typings/react-native/index.d.ts#L1578
import type { AccessibilityProps, AccessibilityRole } from 'react-native'

export type AccessibilityRoleWeb = AccessibilityRole | 'main' | 'region' | 'banner'

interface AccessibilityPropsWeb extends AccessibilityProps {
  accessibilityLevel?: number
  accessibilityRole?: AccessibilityRoleWeb
}
