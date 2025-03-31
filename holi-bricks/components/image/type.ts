import type { ImageContentFit } from 'expo-image'
import type { AccessibilityProps } from 'holi-bricks/accessibility'

export type ImageSource = string | number

export interface ImageProps extends AccessibilityProps {
  source: ImageSource
  width: number
  height: number
  resizeMode?: ImageContentFit
  onError?: () => void
  onLoadEnd?: () => void
  fallbackSource?: string | number
  blurhash?: string
  alt: string
  whiteOverlay?: boolean
}
