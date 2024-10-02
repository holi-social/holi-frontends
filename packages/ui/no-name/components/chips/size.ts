import { TypographySize } from '@holi/ui/no-name/components/typography/Typography'

export const sizeToTypographySize: Record<Size, TypographySize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'xl',
}

export type Size = 'sm' | 'md' | 'lg'
