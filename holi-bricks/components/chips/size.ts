import type { TextSize } from 'holi-bricks/components/text'

export const chipSizeToTextSize: Record<ChipSize, TextSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'xl',
}

export type ChipSize = 'sm' | 'md' | 'lg'
export type ChipSelectSize = 'md' | 'lg'
