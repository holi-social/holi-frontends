import type { LayoutProps } from 'holi-bricks/foundations'
import type { AccessibilityProps } from 'holi-bricks/foundations/accessibility'

export type WebImageSource = string
export type MobileLocalImageSource = number
export type MultiPlatformImageSource = WebImageSource | MobileLocalImageSource

export type MultiPlatformImage = AccessibilityProps &
  LayoutProps & {
    source: MultiPlatformImageSource
    width: number
    height: number
    resizeMode?: 'cover' | 'contain' | 'fill' | 'scale-down'
    onError?: () => void
    onLoadEnd?: () => void
    fallbackSource?: MultiPlatformImageSource
    blurhash?: string
    alt: string
    stretch?: boolean
    aspectRatio?: number | string | undefined
    dimmed?: boolean
  }
