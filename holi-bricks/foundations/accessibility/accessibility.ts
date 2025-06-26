import type { Role } from 'react-native'

export type AccessibilityProps = {
  accessible?: boolean
  id?: string
  role?: Role
  'aria-hidden'?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-disabled'?: boolean
  tabIndex?: -1 | 0
}

type AccessibilityAttributes = keyof AccessibilityProps
const acccessibilityProps: AccessibilityAttributes[] = [
  'accessible',
  'id',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'tabIndex',
]

export const accessibilityProps = (props: AccessibilityProps): AccessibilityProps => {
  return Object.keys(props).reduce((previous, key) => {
    if (acccessibilityProps.includes(key as AccessibilityAttributes)) {
      return { ...previous, ...{ [key]: props[key as AccessibilityAttributes] } }
    } else {
      return previous
    }
  }, {})
}
