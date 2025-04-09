import type { ImageProps } from 'holi-bricks/components/image'
import { setScalingParams } from 'holi-bricks/components/image/helpers'
import { accessibilityProps } from 'holi-bricks/foundations/accessibility'
import NextImage from 'next/image'
import type React from 'react'
import { useState } from 'react'

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
  stretch,
  ...otherProps
}) => {
  const [hasError, setHasError] = useState(false)
  const isRemote = isRemoteSource(source as string)
  const transformedSource = (
    isRemote && typeof width === 'number' && typeof height === 'number'
      ? setScalingParams(source as string, width, height)
      : source
  ) as string

  return (
    <NextImage
      src={hasError && fallbackSource ? (fallbackSource as string) : transformedSource}
      alt={alt}
      role="img"
      aria-label={alt}
      blurDataURL={isRemote ? blurhash : undefined}
      onError={() => {
        setHasError(true)
        // eslint-disable-next-line no-console
        console.warn(`[Image] Failed to load image: ${transformedSource}`)
        if (onError) onError()
      }}
      onLoad={onLoadEnd}
      {...(stretch
        ? {
            fill: true,
            style: { objectFit: resizeMode, flex: 1 },
          }
        : {
            width: width as number | undefined,
            height: height as number | undefined,
            style: { objectFit: resizeMode },
          })}
      {...accessibilityProps(otherProps)}
    />
  )
}
