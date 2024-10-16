import { Role } from 'react-native'

export type AccessibilityProps = {
  id?: string
  role?: Role
  'aria-hidden'?: boolean
  'aria-label'?: string
}

export type InteractiveAccessibilityProps = AccessibilityProps & {
  tabIndex?: -1 | 0 | undefined
}

export const accessibilityProps = (props: AccessibilityProps) => {
  const { id, role, 'aria-label': ariaLabel, 'aria-hidden': ariaHidden } = props
  return { id, role, 'aria-label': ariaLabel, 'aria-hidden': ariaHidden }
}

export const interactiveAccessibilityProps = (props: InteractiveAccessibilityProps) => {
  const { tabIndex } = props
  return {
    ...accessibilityProps(props),
    tabIndex,
  }
}
