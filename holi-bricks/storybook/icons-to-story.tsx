import * as Icons from '@holi/icons/src/generated'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { InputType } from '@storybook/core/types'

const entries = Object.entries(Icons)

const iconOptions: HoliIconType[] = entries.map(([, comp]) => comp)
const iconLabels: Record<string, string> = entries.reduce(
  (acc, [name, comp]) => {
    acc[comp.toString()] = name
    return acc
  },
  {} as Record<string, string>
)

export const toIconName = (icon?: HoliIconType): string => {
  if (!icon) return 'undefined'
  return iconLabels[icon.toString()] ?? '() => {}'
}

export const controlWithLabel = {
  control: {
    type: 'select',
    labels: iconLabels,
  } as InputType['control'],
  options: iconOptions as InputType['options'],
}
