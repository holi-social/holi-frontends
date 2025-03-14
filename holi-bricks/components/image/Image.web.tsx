import type { ImageProps } from 'holi-bricks/components/image'
import type React from 'react'
import { useState } from 'react'
import NextImage from 'next/image'
import { accessibilityProps } from 'holi-bricks/accessibility'
import { setScalingParams } from 'holi-bricks/components/image/helpers'

export const isRemoteSource = (source: string): source is string => {
  return /^(https?:)?\/\//i.test(source)
}

export const Image: React.FC<ImageProps> = ({
  source,
  alt,
  width,
  height,
  resizeMode = 'cover',
  onError,
  onLoadEnd,
  fallbackSource,
  blurhash,
  ...otherProps
}) => {
  const [hasError, setHasError] = useState(false)
  const isRemote = isRemoteSource(source as string)
  const transformedSource = (isRemote ? setScalingParams(source as string, width, height) : source) as string

  return (
    <NextImage
      src={hasError && fallbackSource ? (fallbackSource as string) : transformedSource}
      alt={alt}
      role="img"
      aria-label={alt}
      blurDataURL={isRemote ? blurhash : undefined}
      width={width}
      height={height}
      style={{ objectFit: resizeMode }}
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
