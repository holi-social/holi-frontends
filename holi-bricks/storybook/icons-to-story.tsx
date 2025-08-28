import * as Icons from '@holi/icons/src/generated'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { ControlType } from '@storybook/addon-docs/blocks'

const iconOptions = Object.keys(Icons)
export const iconLabels = Object.keys(Icons).reduce(
  (acc, name) => {
    acc[name] = name
    return acc
  },
  {} as Record<string, string>
)

export const toIconName = (icon?: HoliIconType): string => {
  if (!icon) return 'undefined'
  return iconLabels[icon.toString()] ?? '() => {}'
}

export const controlWithLabel = {
  options: iconOptions, // ['AddBox', 'AccountCircle', 'ArrowLeft', ...]
  mapping: Icons, // { AddBox: AddBox, AccountCircle: AccountCircle, ...}
  control: {
    type: 'select' as ControlType,
    labels: iconLabels, // { AddBox: 'AddBox', AccountCircle: 'AccountCircle', ...}
  },
}
