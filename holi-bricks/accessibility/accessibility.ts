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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const accessibilityProps = (props: { [k: string]: any }): AccessibilityProps => {
  return Object.keys(props).reduce((previous, key) => {
    if (acccessibilityProps.includes(key as AccessibilityAttributes)) {
      return { ...previous, ...{ [key]: props[key] } }
    } else {
      return previous
    }
  }, {})
}
