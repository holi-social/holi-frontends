import type { MultiPlatformImage } from 'holi-bricks/components/image'
import { transformSource } from 'holi-bricks/components/image/helpers'
import { imageStretching } from 'holi-bricks/components/image/styles'
import { layoutStyle } from 'holi-bricks/foundations'
import { accessibilityProps } from 'holi-bricks/foundations/accessibility'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
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
      blurDataURL={isRemote ? blurhash : undefined}
      width={width}
      height={height}
      objectFit={resizeMode}
      style={{
        ...styles.imageStretching(stretch, aspectRatio),
        ...layoutStyle(otherProps),
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

export const stylesheet = createStyleSheet({
  imageStretching,
})
