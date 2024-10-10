import { TypographySize } from '@holi/ui/no-name/components/typography/Typography'

export const chipSizeToTypographySize: Record<ChipSize, TypographySize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'xl',
}

export type ChipSize = 'sm' | 'md' | 'lg'
