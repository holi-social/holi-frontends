import type { AccessibilityProps } from 'holi-bricks/foundations/accessibility'

export type ImageSource = string | number

export interface ImageProps extends AccessibilityProps {
  source: ImageSource
  width: number
  height: number
  resizeMode?: 'cover' | 'contain' | 'fill' | 'scale-down'
  onError?: () => void
  onLoadEnd?: () => void
  fallbackSource?: string | number
  blurhash?: string
  alt: string
  stretch?: boolean
  aspectRatio?: number | string | undefined
}
