import type { AccessibilityProps, AccessibilityRole } from 'react-native'

declare module '*.scss'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.gif'

export type AccessibilityRoleWeb = AccessibilityRole | 'main' | 'region'

interface AccessibilityPropsWeb extends AccessibilityProps {
  accessibilityLevel?: number
  accessibilityRole?: AccessibilityRoleWeb
}
