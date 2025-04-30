import type { MultiPlatformImage } from 'holi-bricks/components/image'
import { transformSource } from 'holi-bricks/components/image/helpers'
import { accessibilityProps } from 'holi-bricks/foundations/accessibility'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import NextImage from 'next/image'
import type React from 'react'
import { useState } from 'react'

export const isRemoteSource = (source: string): source is string => {
  return /^(https?:)?\/\//i.test(source)
}

export const Image: React.FC<MultiPlatformImage> = ({
  source,
  alt,
  width,
  height,
  resizeMode = 'cover',
  onError,
  onLoadEnd,
  fallbackSource,
  blurhash,
  stretch,
  aspectRatio,
  ...otherProps
}) => {
  const { styles } = useStyles(stylesheet)
  const [hasError, setHasError] = useState(false)
  const isRemote = isRemoteSource(source as string)
  const transformedSource = (
    isRemote && typeof width === 'number' && typeof height === 'number'
      ? transformSource(source as string, width, height)
      : source
  ) as string

  return (
    <NextImage
      src={(hasError || !source) && fallbackSource ? (fallbackSource as string) : transformedSource}
      alt={alt}
      role="img"
      aria-label={alt}
      blurDataURL={isRemote ? blurhash : undefined}
      width={width}
      height={height}
      style={{
        ...styles.objectFit(resizeMode),
        ...styles.aspectRatio(aspectRatio),
        ...styles.stretch(stretch),
      }}
      onError={() => {
        setHasError(true)
        // eslint-disable-next-line no-console
        console.warn(`[Image] Failed to load image: ${transformedSource}`)
        if (onError) onError()
      }}
      onLoad={onLoadEnd}
      {...accessibilityProps(otherProps)}
    />
  )
}

const stylesheet = createStyleSheet({
  objectFit: (resize?: MultiPlatformImage['resizeMode']) => ({
    objectFit: resize,
  }),
  aspectRatio: (n?: string | number) => ({
    aspectRatio: n,
  }),
  stretch: (full?: boolean) => {
    if (!full) return {}
    return {
      width: '100%',
      height: '100%',
    }
  },
})
