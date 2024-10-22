import { TextSize } from 'holi-bricks/components/text/Text'

export const chipSizeToTextSize: Record<ChipSize, TextSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'xl',
}

export type ChipSize = 'sm' | 'md' | 'lg'
