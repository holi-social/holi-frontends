import { TextSize } from '@holi/ui/no-name/components/text/Text'

export const chipSizeToTextSize: Record<ChipSize, TextSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'xl',
}

export type ChipSize = 'sm' | 'md' | 'lg'
