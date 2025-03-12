import type React from 'react'
import { useState } from 'react'
import { Image as RNImage } from 'react-native'
import { Image as ExpoImage } from 'expo-image'
//import { WithLocalSvg } from 'react-native-svg/css'
import { accessibilityProps } from 'holi-bricks/accessibility'
import type { ImageProps } from 'holi-bricks/components/image/type'
import { setScalingParams } from 'holi-bricks/components/image/helpers'

const isLocalSvg = (source: number) => {
  try {
    const resolvedSource = RNImage.resolveAssetSource(source)
    if (!resolvedSource || !resolvedSource.uri) return false
    const uri = resolvedSource.uri
    return /\.svg(\?|#|$)/i.test(uri)
  } catch {
    return false
  }
}

export const isRemoteSource = (source: string | number): source is string => {
  return typeof source === 'string'
}

export const Image: React.FC<ImageProps> = ({
  source,
  width,
  height,
  resizeMode = 'cover',
  onError,
  onLoadEnd,
  fallbackSource,
  blurhash,
  alt,
  ...otherProps
}) => {
  const [hasError, setHasError] = useState(false)
  const transformedSource = setScalingParams(source, width, height)
  const isRemote = isRemoteSource(source)
  const localSvg = typeof source === 'number' && isLocalSvg(source)

  if (!source) return null

  if (localSvg) {
    const { WithLocalSvg } = require('react-native-svg/css')
    return (
      <WithLocalSvg
        role="image"
        aria-label={alt}
        asset={source}
        width={width}
        accessibilityLabel={alt}
        accessible={otherProps?.['aria-hidden'] === true}
        accessibilityRole={otherProps?.['aria-hidden'] === true ? 'none' : 'image'}
        height={height}
        {...accessibilityProps(otherProps)}
      />
    )
  }

  return (
    <ExpoImage
      source={hasError && fallbackSource ? fallbackSource : transformedSource}
      alt={alt}
      role="image"
      accessibilityLabel={alt}
      accessibilityRole={otherProps?.['aria-hidden'] === true ? 'none' : 'image'}
      accessible={otherProps?.['aria-hidden'] === true}
      placeholder={isRemote ? blurhash : undefined}
      style={[{ width, height }]}
      contentFit={resizeMode}
      onError={() => {
        setHasError(true)
        // eslint-disable-next-line no-console
        console.warn(`[Image] Failed to load image: ${source}`)
        if (onError) onError()
      }}
      aria-label={alt}
      onLoadEnd={onLoadEnd}
      {...accessibilityProps(otherProps)}
    />
  )
}
